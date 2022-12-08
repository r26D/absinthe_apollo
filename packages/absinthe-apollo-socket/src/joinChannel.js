//

import handlePush from './handlePush.js'
import notifierNotifyActive from './notifier/notifyActive.js'
import pushRequest from './pushRequest.js'
import { createErrorEvent } from './notifier/event/eventCreators.js'

const createChannelJoinError = (message) =>
  new Error(`channel join: ${message}`)

const notifyErrorToAllActive = (absintheSocket, errorMessage) =>
  absintheSocket.notifiers.forEach((notifier) =>
    notifierNotifyActive(
      notifier,
      createErrorEvent(createChannelJoinError(errorMessage))
    )
  )

// join Push is reused and so the handler
// https://github.com/phoenixframework/phoenix/blob/master/assets/js/phoenix.js#L356
const createChannelJoinHandler = (absintheSocket) => ({
  onError: (errorMessage) =>
    notifyErrorToAllActive(absintheSocket, errorMessage),

  onSucceed: () => {
    absintheSocket.notifiers.forEach((notifier) =>
      pushRequest(absintheSocket, notifier)
    )

    if (absintheSocket.phoenixSocket.absintheRejoined) {
      absintheSocket.phoenixSocket.absintheRejoined()
    }
  },
  onTimeout: () => notifyErrorToAllActive(absintheSocket, 'timeout')
})

const joinChannel = (absintheSocket) => {
  handlePush(
    absintheSocket.channel.join(),
    createChannelJoinHandler(absintheSocket)
  )

  absintheSocket.channelJoinCreated = true

  return absintheSocket
}

export default joinChannel
