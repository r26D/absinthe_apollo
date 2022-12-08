import {
  ApolloLink,
  Observable,
  selectURI,
  selectHttpOptionsAndBody,
  fallbackHttpConfig,
  serializeFetchParameter,
  createSignalIfSupported,
  parseAndCheckHttpResponse,
} from '@apollo/client'


import lodashSet from 'lodash/set'

import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWYZ', 10)

import extractFiles  from "extract-files/extractFiles.mjs"
//const extractFiles = () => {}
// async function mjsLoader() {
// const { extractFiles } = await import('extract-files/extractFiles.mjs')
//   return extractFiles
// }
// const extractFiles = mjsLoader()
//https://github.com/jaydenseric/extract-files/blob/v11.0.0/public/ReactNativeFile.js
//Was removed in more recent
export class ReactNativeFile {
  constructor({uri, name, type}) {
    this.uri = uri;
    this.name = name;
    this.type = type;
  }
};


/**
 * GraphQL request `fetch` options.
 * @kind typedef
 * @name FetchOptions
 * @type {object}
 * @see [Polyfillable fetch options](https://github.github.io/fetch#options).
 * @prop {object} headers HTTP request headers.
 * @prop {string} [credentials] Authentication credentials mode.
 */

/**
 * Creates a terminating [Apollo Link](https://apollographql.com/docs/link)
 * capable of file uploads. Options match [`createHttpLink`](https://apollographql.com/docs/link/links/http#options).
 * @see [GraphQL multipart request spec](https://github.com/jaydenseric/graphql-multipart-request-spec).
 * @see [apollo-link on GitHub](https://github.com/apollographql/apollo-link).
 * @kind function
 * @name createUploadLink
 * @param {object} options Options.
 * @param {string} [options.uri=/graphql] GraphQL endpoint URI.
 * @param {Function} [options.fetch] [`fetch`](https://fetch.spec.whatwg.org) implementation to use, defaulting to the `fetch` global.
 * @param {FetchOptions} [options.fetchOptions] `fetch` options; overridden by upload requirements.
 * @param {string} [options.credentials] Overrides `options.fetchOptions.credentials`.
 * @param {object} [options.headers] Merges with and overrides `options.fetchOptions.headers`.
 * @param {boolean} [options.includeExtensions=false] Toggles sending `extensions` fields to the GraphQL server.
 * @returns {ApolloLink} A terminating [Apollo Link](https://apollographql.com/docs/link) capable of file uploads.
 * @example <caption>A basic Apollo Client setup.</caption>
 * ```js
 * const { ApolloClient } = require('apollo-client')
 * const { InMemoryCache } = require('apollo-cache-inmemory')
 * const { createUploadLink } = require('apollo-upload-client')
 *
 * const client = new ApolloClient({
 *   cache: new InMemoryCache(),
 *   link: createUploadLink()
 * })
 * ```
 */
export const createUploadLink = ({
                              uri: fetchUri = '/graphql',
                              fetch: linkFetch = fetch,
                              fetchOptions,
                              credentials,
                              headers,
                              includeExtensions,
                            } = {}) => {
  const linkConfig = {
    http: {includeExtensions},
    options: fetchOptions,
    credentials,
    headers,
  }

  return new ApolloLink((operation) => {
    const uri = selectURI(operation, fetchUri)
    const context = operation.getContext()

    // Apollo Engine client awareness:
    // https://apollographql.com/docs/platform/client-awareness

    const {
      // From Apollo Client config.
      clientAwareness: {name, version} = {},
      headers,
    } = context

    const contextConfig = {
      http: context.http,
      options: context.fetchOptions,
      credentials: context.credentials,
      headers: {
        // Client awareness headers are context overridable.
        ...(name && {'apollographql-client-name': name}),
        ...(version && {'apollographql-client-version': version}),
        ...headers,
      },
    }

    const {options, body} = selectHttpOptionsAndBody(
      operation,
      fallbackHttpConfig,
      linkConfig,
      contextConfig
    )

    const {clone, files} = extractFiles(body)

    const payload = serializeFetchParameter(clone, 'Payload')
    if (files.size) {
      // Automatically set by fetch when the body is a FormData instance.
      delete options.headers['content-type']

      // Format body for Absinthe GraphQL, NOT according to GraphQL multipart request spec
      // (see https://github.com/absinthe-graphql/absinthe_plug/issues/114)

      const form = new FormData()

      const {query, operationName, variables} = body
      form.append('query', query)
      form.append('operationName', operationName)

      //This appends the file to the FormData
      //It also changes all references in the variables
      //to use the same short code

      files.forEach((uses, file) => {
        const fileShortId = nanoid()
        form.append(fileShortId, file)
        uses.forEach((ref) => {
          const usage = ref.split('.')
          usage.shift() //Removes the variables from the path
          lodashSet(variables, usage, fileShortId)
        })
      })
      form.append('variables', JSON.stringify(variables))
      options.body = form
    } else options.body = payload

    return new Observable((observer) => {
      // If no abort controller signal was provided in fetch options, and the
      // environment supports the AbortController interface, create and use a
      // default abort controller.
      let abortController
      if (!options.signal) {
        const {controller} = createSignalIfSupported()
        if (controller) {
          abortController = controller
          options.signal = abortController.signal
        }
      }

      linkFetch(uri, options)
        .then((response) => {
          // Forward the response on the context.
          operation.setContext({response})
          return response
        })
        .then(parseAndCheckHttpResponse(operation))
        .then((result) => {
          observer.next(result)
          observer.complete()
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            // Fetch was aborted.
            return
          }
          if (error.name === 'TypeError' && error.message.match("Failed to fetch")) {
            // The endpoint is not responding
            return
          }

          if (error.result && error.result.errors && error.result.data)
            // There is a GraphQL result to forward.
            observer.next(error.result)

          observer.error(error)
        })

      // Cleanup function.
      return () => {
        if (abortController)
          // Abort fetch.
          abortController.abort()
      }
    })
  })
}
