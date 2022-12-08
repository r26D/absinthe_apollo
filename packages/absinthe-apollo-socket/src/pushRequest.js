//

import notifierNotifyResultEvent from './notifier/notifyResultEvent.js'
import notifierNotifyStartEvent from './notifier/notifyStartEvent.js'
import notifierRemove from './notifier/remove.js'
import pushRequestUsing from './pushRequestUsing.js'
import refreshNotifier from './refreshNotifier.js'
import requestStatuses from './notifier/requestStatuses.js'
import updateNotifiers from './updateNotifiers.js'
import { subscribe } from './subscription.js'

const setNotifierRequestStatusSent = (absintheSocket, notifier) =>
  refreshNotifier(absintheSocket, {
    ...notifier,
    requestStatus: requestStatuses.sent
  })

const onQueryOrMutationSucceed = (absintheSocket, notifier, response) =>
  updateNotifiers(
    absintheSocket,
    notifierRemove(
      notifierNotifyResultEvent(
        setNotifierRequestStatusSent(absintheSocket, notifier),
        response
      )
    )
  )

const pushQueryOrMutation = (absintheSocket, notifier) =>
  pushRequestUsing(
    absintheSocket,
    notifierNotifyStartEvent(notifier),
    onQueryOrMutationSucceed
  )

const pushRequest = (absintheSocket, notifier) => {
  if (notifier.operationType === 'subscription') {
    subscribe(absintheSocket, notifier)
  } else {
    pushQueryOrMutation(absintheSocket, notifier)
  }
}

export default pushRequest
