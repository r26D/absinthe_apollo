//

import handlePush from './handlePush'
import notifierNotifyActive from './notifier/notifyActive'
import pushRequest from './pushRequest'
import { createErrorEvent } from './notifier/event/eventCreators'

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
const createChannelJoinHandler = (absintheSocket, notifiers) => ({
  onError: (errorMessage) =>
    notifyErrorToAllActive(absintheSocket, errorMessage),

  onSucceed: () => {
    notifiers.forEach((notifier) =>
      pushRequest(absintheSocket, notifier)
    )

    if (absintheSocket.phoenixSocket.absintheRejoined) {
      absintheSocket.phoenixSocket.absintheRejoined()
    }
  },
  onTimeout: () => notifyErrorToAllActive(absintheSocket, 'timeout')
})

const joinChannel = (absintheSocket) => {
  const notifiers = absintheSocket.notifiers
  handlePush(
    absintheSocket.channel.join(),
    createChannelJoinHandler(absintheSocket, notifiers)
  )

  absintheSocket.channelJoinCreated = true

  return absintheSocket
}

export default joinChannel
