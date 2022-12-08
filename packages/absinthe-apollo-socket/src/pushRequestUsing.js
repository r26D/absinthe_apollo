//

import { requestToCompat } from '@jumpn/utils-graphql'

import abortNotifier from './abortNotifier.js'
import notifierNotifyActive from './notifier/notifyActive.js'
import pushAbsintheEvent from './pushAbsintheEvent.js'
import refreshNotifier from './refreshNotifier.js'
import requestStatuses from './notifier/requestStatuses.js'
import { createAbsintheDocEvent } from './absinthe-event/absintheEventCreators.js'
import { createErrorEvent } from './notifier/event/eventCreators.js'

const pushAbsintheDocEvent = (
  absintheSocket,
  { request },
  notifierPushHandler
) =>
  pushAbsintheEvent(
    absintheSocket,
    request,
    notifierPushHandler,
    createAbsintheDocEvent(requestToCompat(request))
  )

const setNotifierRequestStatusSending = (absintheSocket, notifier) =>
  refreshNotifier(absintheSocket, {
    ...notifier,
    requestStatus: requestStatuses.sending
  })

/*
Modified to support standard absinthe errors:
 https://hexdocs.pm/absinthe/errors.html
{:error, ["Simple message",  %{message: "A map error"}]}

 */

const createRequestError = (message) => {
  if (message?.errors) {
    return message.errors
  } else {
    return { errors: [{ message: message }] }
  }
}

const onTimeout = (absintheSocket, notifier) =>
  notifierNotifyActive(
    notifier,
    createErrorEvent(createRequestError('timeout'))
  )

const onError = (absintheSocket, notifier, errorMessage) =>
  abortNotifier(absintheSocket, notifier, createRequestError(errorMessage))

const getNotifierPushHandler = (onSucceed) => ({
  onError,
  onSucceed,
  onTimeout
})

const pushRequestUsing = (absintheSocket, notifier, onSucceed) =>
  pushAbsintheDocEvent(
    absintheSocket,
    setNotifierRequestStatusSending(absintheSocket, notifier),
    getNotifierPushHandler(onSucceed)
  )

export { pushRequestUsing as default, onError }
