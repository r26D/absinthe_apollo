import { ApolloLink } from '@apollo/client'
import { send, toObservable, unobserveOrCancel } from '@r26d/absinthe-apollo-socket'
import compose from 'ramda/src/compose'
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
const createAbsintheApolloLink = (absintheSocket, onError, onStart) =>
  new ApolloLink(
    compose(
      notifierToObservable(absintheSocket, onError, onStart),
      (request) => send(absintheSocket, request),
      getRequest
    )
  )

export default createAbsintheApolloLink
