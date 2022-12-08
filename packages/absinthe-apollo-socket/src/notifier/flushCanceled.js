//

import notifyCanceled from './notifyCanceled.js'
import { createCancelEvent } from './event/eventCreators.js'

const clearCanceled = (notifier) => ({
  ...notifier,
  canceledObservers: []
})

const flushCanceled = (notifier) =>
  notifier.canceledObservers.length > 0
    ? clearCanceled(notifyCanceled(notifier, createCancelEvent()))
    : notifier

export default flushCanceled
