//

import { compositeMap } from '@r26d/utils-graphql'

import handlePush from './handlePush.js'
import notifierFind from './notifier/find.js'

const getPushHandlerMethodGetter =
  (absintheSocket, request) =>
  (handle) =>
  (...args) => {
    const notifier = notifierFind(absintheSocket.notifiers, 'request', request)

    if (notifier) {
      handle(absintheSocket, notifier, ...args)
    }
  }

const getPushHandler = (absintheSocket, request, notifierPushHandler) =>
  compositeMap(getPushHandlerMethodGetter(absintheSocket, request), notifierPushHandler)

const pushAbsintheEvent = (
  absintheSocket,
  request,
  notifierPushHandler,
  absintheEvent
) => {
  handlePush(
    absintheSocket.channel.push(absintheEvent.name, absintheEvent.payload),
    getPushHandler(absintheSocket, request, notifierPushHandler)
  )

  return absintheSocket
}

export default pushAbsintheEvent
