//

import { ApolloLink } from 'apollo-link'
import { send, toObservable, unobserveOrCancel } from '@absinthe/socket'
import { compose } from 'flow-static-land/lib/Fun'
import { print } from 'graphql'

const unobserveOrCancelIfNeeded = (absintheSocket, notifier, observer) => {
  if (notifier && observer) {
    unobserveOrCancel(absintheSocket, notifier, observer)
  }
}

const notifierToObservable = (absintheSocket, onError, onStart) => (notifier) =>
  toObservable(absintheSocket, notifier, {
    onError,
    onStart,
    unsubscribe: unobserveOrCancelIfNeeded
  })

const getRequest = ({ query, variables }) => ({
  operation: print(query),
  variables
})

/**
 * Creates a terminating ApolloLink to request operations using given
 * AbsintheSocket instance
 */
const createAbsintheSocketLink = (absintheSocket, onError, onStart) =>
  new ApolloLink(
    compose(
      notifierToObservable(absintheSocket, onError, onStart),
      (request) => send(absintheSocket, request),
      getRequest
    )
  )

export default createAbsintheSocketLink
