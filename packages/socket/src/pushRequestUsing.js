//

import { requestToCompat } from '@jumpn/utils-graphql'

import abortNotifier from './abortNotifier'
import notifierNotifyActive from './notifier/notifyActive'
import pushAbsintheEvent from './pushAbsintheEvent'
import refreshNotifier from './refreshNotifier'
import requestStatuses from './notifier/requestStatuses'
import { createAbsintheDocEvent } from './absinthe-event/absintheEventCreators'
import { createErrorEvent } from './notifier/event/eventCreators'

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
    return(message.errors);
  }
  else {
    return({errors: [{message: message}]});
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
