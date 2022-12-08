//

import { map } from '@jumpn/utils-composite'

import handlePush from './handlePush'
import notifierFind from './notifier/find'

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
  map(getPushHandlerMethodGetter(absintheSocket, request), notifierPushHandler)

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
