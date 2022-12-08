//

import notifyActive from './notifyActive'
import { createResultEvent } from './event/eventCreators.js'

const notifyResultEvent = (notifier, result) =>
  notifyActive(notifier, createResultEvent(result))

export default notifyResultEvent
