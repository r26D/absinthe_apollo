import subscriptions from './subscriptions'

import {booleanize} from "@r26d/utils-graphql"

/**
 * Returns a promise that resolves to `true` in case subscription of given
 * disposable has started or to `false` otherwise
 */
const isSubscribed = (disposable) => {
  const maybeSubscription = subscriptions.get(disposable)

  return maybeSubscription
    ? booleanize(maybeSubscription)
    : Promise.resolve(false)
}

export default isSubscribed
