import {ApolloLink}  from '@apollo/client/link/core/index.js'
import {
  send,
  toObservable,
  unobserveOrCancel
} from '@r26d/absinthe-apollo-socket'
//import compose from 'ramda/src/compose'
//12/7/22 - this is not compatible with node 18
//https://github.com/ramda/ramda/commit/d0099847b50660f3ddefc528c0813e9983d6b394
// import { compose } from 'ramda'
//as of 3/25/23 - no updates to ramda - trying a different lib
import {compose } from 'rambda'
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
const createAbsintheApolloLink = function(absintheSocket, onError, onStart) {
    return new ApolloLink(
        compose(
            notifierToObservable(absintheSocket, onError, onStart),
            (request) => send(absintheSocket, request),
            getRequest
        )
    )
}
export default createAbsintheApolloLink;
