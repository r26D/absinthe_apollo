//

import notifierNotify from './notifier/notify'
import notifierRemove from './notifier/remove'
import updateNotifiers from './updateNotifiers'
import { createAbortEvent } from './notifier/event/eventCreators'

const abortNotifier = (absintheSocket, notifier, error) =>
  updateNotifiers(
    absintheSocket,
    notifierRemove(notifierNotify(notifier, createAbortEvent(error)))
  )

export default abortNotifier
