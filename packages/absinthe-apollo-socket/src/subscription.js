//

import { errorsToString as gqlErrorsToString } from '@jumpn/utils-graphql'

import abortNotifier from './abortNotifier.js'
import notifierFind from './notifier/find.js'
import notifierFlushCanceled from './notifier/flushCanceled.js'
import notifierNotifyCanceled from './notifier/notifyCanceled.js'
import notifierNotifyResultEvent from './notifier/notifyResultEvent.js'
import notifierNotifyStartEvent from './notifier/notifyStartEvent.js'
import notifierRemove from './notifier/remove.js'
import notifierReset from './notifier/reset.js'
import pushAbsintheEvent from './pushAbsintheEvent.js'
import pushRequestUsing, { onError } from './pushRequestUsing.js'
import refreshNotifier from './refreshNotifier.js'
import requestStatuses from './notifier/requestStatuses.js'
import updateNotifiers from './updateNotifiers.js'
import { createAbsintheUnsubscribeEvent } from './absinthe-event/absintheEventCreators.js'
import { createErrorEvent } from './notifier/event/eventCreators.js'

// TODO: improve this type

const onUnsubscribeSucceedCanceled = (absintheSocket, notifier) =>
  updateNotifiers(
    absintheSocket,
    notifierRemove(notifierFlushCanceled(notifier))
  )

const onUnsubscribeSucceedActive = (absintheSocket, notifier) =>
  subscribe(
    absintheSocket,
    refreshNotifier(absintheSocket, notifierReset(notifier))
  )

const createUnsubscribeError = (message) => new Error(`unsubscribe: ${message}`)

const unsubscribeHandler = {
  onError: (absintheSocket, notifier, errorMessage) =>
    abortNotifier(
      absintheSocket,
      notifier,
      createUnsubscribeError(errorMessage)
    ),

  onTimeout: (absintheSocket, notifier) =>
    notifierNotifyCanceled(
      notifier,
      createErrorEvent(createUnsubscribeError('timeout'))
    ),

  onSucceed: (absintheSocket, notifier) => {
    if (notifier.isActive) {
      onUnsubscribeSucceedActive(absintheSocket, notifier)
    } else {
      onUnsubscribeSucceedCanceled(absintheSocket, notifier)
    }
  }
}

const pushAbsintheUnsubscribeEvent = (
  absintheSocket,
  { request, subscriptionId }
) =>
  pushAbsintheEvent(
    absintheSocket,
    request,
    unsubscribeHandler,
    createAbsintheUnsubscribeEvent({ subscriptionId })
  )

const unsubscribe = (absintheSocket, notifier) =>
  pushAbsintheUnsubscribeEvent(
    absintheSocket,
    refreshNotifier(absintheSocket, {
      ...notifier,
      requestStatus: requestStatuses.canceling
    })
  )

const onSubscribeSucceed = (absintheSocket, notifier, { subscriptionId }) => {
  const subscribedNotifier = refreshNotifier(absintheSocket, {
    ...notifier,
    subscriptionId,
    requestStatus: requestStatuses.sent
  })

  if (subscribedNotifier.isActive) {
    notifierNotifyStartEvent(subscribedNotifier)
  } else {
    unsubscribe(absintheSocket, subscribedNotifier)
  }
}

const onSubscribe = (absintheSocket, notifier, response) => {
  if (response.errors) {
    onError(absintheSocket, notifier, gqlErrorsToString(response.errors))
  } else {
    onSubscribeSucceed(absintheSocket, notifier, response)
  }
}

const subscribe = (absintheSocket, notifier) =>
  pushRequestUsing(absintheSocket, notifier, onSubscribe)

const onDataMessage = (absintheSocket, { payload }) => {
  const notifier = notifierFind(
    absintheSocket.notifiers,
    'subscriptionId',
    payload.subscriptionId
  )

  if (notifier) {
    notifierNotifyResultEvent(notifier, payload.result)
  }
}

const dataMessageEventName = 'subscription:data'

const isDataMessage = (message) => message.event === dataMessageEventName

export { isDataMessage, onDataMessage, subscribe, unsubscribe }
