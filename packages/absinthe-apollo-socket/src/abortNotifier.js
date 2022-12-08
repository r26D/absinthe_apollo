//

import notifierNotify from './notifier/notify.js'
import notifierRemove from './notifier/remove.js'
import updateNotifiers from './updateNotifiers.js'
import { createAbortEvent } from './notifier/event/eventCreators.js'

const abortNotifier = (absintheSocket, notifier, error) =>
  updateNotifiers(
    absintheSocket,
    notifierRemove(notifierNotify(notifier, createAbortEvent(error)))
  )

export default abortNotifier
