import abortNotifier from './abortNotifier.js'
import joinChannel from './joinChannel.js'
import notifierNotify from './notifier/notify.js'
import notifierRemove from './notifier/remove.js'
import notifierReset from './notifier/reset.js'
import refreshNotifier from './refreshNotifier.js'
import updateNotifiers from './updateNotifiers.js'
import * as withSubscription from './subscription.js'
import { createErrorEvent } from './notifier/event/eventCreators.js'

const onMessage = (absintheSocket) => (message) => {
  if (withSubscription.isDataMessage(message)) {
    withSubscription.onDataMessage(absintheSocket, message)
  }
}

const createConnectionCloseError = () => new Error('connection: close')

const notifyConnectionCloseError = (notifier) =>
  notifierNotify(notifier, createErrorEvent(createConnectionCloseError()))

const notifierOnConnectionCloseCanceled = (absintheSocket, notifier) =>
  updateNotifiers(
    absintheSocket,
    notifierRemove(notifyConnectionCloseError(notifier))
  )

const notifierOnConnectionCloseActive = (absintheSocket, notifier) => {
  if (notifier.operationType === 'mutation') {
    abortNotifier(absintheSocket, notifier, createConnectionCloseError())
  } else {
    refreshNotifier(
      absintheSocket,
      notifierReset(notifyConnectionCloseError(notifier))
    )
  }
}

const notifierOnConnectionClose = (absintheSocket) => (notifier) => {
  if (notifier.isActive) {
    notifierOnConnectionCloseActive(absintheSocket, notifier)
  } else {
    notifierOnConnectionCloseCanceled(absintheSocket, notifier)
  }
}

const onConnectionClose = (absintheSocket) => () =>
  absintheSocket.notifiers.forEach(notifierOnConnectionClose(absintheSocket))

const shouldJoinChannel = (absintheSocket) =>
  !absintheSocket.channelJoinCreated && absintheSocket.notifiers.length > 0

const onConnectionOpen = (absintheSocket) => () => {
  if (shouldJoinChannel(absintheSocket)) {
    joinChannel(absintheSocket)
  }
}

const absintheChannelName = '__absinthe__:control'

/**
 * Creates an Absinthe Socket using the given Phoenix Socket instance
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 * import {Socket as PhoenixSocket} from "phoenix";

 * const absintheSocket = withAbsintheSocket.create(
 *   new PhoenixSocket("ws://localhost:4000/socket")
 * );
 */
const create = (phoenixSocket) => {
  const absintheSocket = {
    phoenixSocket,
    channel: phoenixSocket.channel(absintheChannelName),
    channelJoinCreated: false,
    notifiers: []
  }

  phoenixSocket.onOpen(onConnectionOpen(absintheSocket))
  phoenixSocket.onClose(onConnectionClose(absintheSocket))
  phoenixSocket.onMessage(onMessage(absintheSocket))

  return absintheSocket
}

export default create
