//

import * as withAbsintheSocket from '@r26d/absinthe-apollo-socket'
import { requestFromCompat } from '@jumpn/utils-graphql'
import { Socket as PhoenixSocket } from 'phoenix'

const observe = (subscriptionsClient, notifier, callback) =>
  withAbsintheSocket.observe(subscriptionsClient.absintheSocket, notifier, {
    onAbort: callback,
    onResult: (result) => callback(null, result)
  })

const generateRequestKey = (subscriptionsClient) => {
  subscriptionsClient.requestsCount += 1

  return String(subscriptionsClient.requestsCount)
}

const storeRequest = (subscriptionsClient, request) => {
  const requestKey = generateRequestKey(subscriptionsClient)

  subscriptionsClient.requests.set(request, requestKey)

  return requestKey
}

const storeRequestIfNeeded = (subscriptionsClient, request) => {
  const requestKey = subscriptionsClient.requests.get(request)

  return requestKey !== undefined
    ? requestKey
    : storeRequest(subscriptionsClient, request)
}

const findNotifier = (subscriptionsClient, request) =>
  subscriptionsClient.absintheSocket.notifiers.find(
    (notifier) => notifier.request === request
  )

// eslint-disable-next-line consistent-return
const findRequest = (subscriptionsClient, requestKey) => {
  for (const [request, key] of subscriptionsClient.requests.entries()) {
    if (key === requestKey) return request
  }
}

const cancel = (subscriptionsClient, notifier) => {
  withAbsintheSocket.cancel(subscriptionsClient.absintheSocket, notifier)

  subscriptionsClient.requests.delete(notifier.request)
}

export default class SubscriptionsClient {
  absintheSocket

  requestsCount = 0

  requests

  constructor(socketUrl, options) {
    this.absintheSocket = withAbsintheSocket.create(
      new PhoenixSocket(socketUrl, options)
    )

    this.requests = new Map()
  }

  close() {
    this.absintheSocket.phoenixSocket.disconnect()
  }

  subscribe(requestCompat, callback) {
    const notifier = withAbsintheSocket.send(
      this.absintheSocket,
      requestFromCompat(requestCompat)
    )

    const requestKey = storeRequestIfNeeded(this, notifier.request)

    observe(this, notifier, callback)

    return requestKey
  }

  unsubscribe(requestKey) {
    const request = findRequest(this, requestKey)

    if (request) {
      const notifier = findNotifier(this, request)

      if (notifier) cancel(this, notifier)
    }
  }

  unsubscribeAll() {
    this.absintheSocket.notifiers.forEach((notifier) => cancel(this, notifier))
  }
}
