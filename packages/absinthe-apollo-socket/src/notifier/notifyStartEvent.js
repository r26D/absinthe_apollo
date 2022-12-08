//

import notifyActive from './notifyActive.js'
import { createStartEvent } from './event/eventCreators.js'
const notifyStartEvent = (notifier) =>
  notifyActive(notifier, createStartEvent(notifier))

export default notifyStartEvent
