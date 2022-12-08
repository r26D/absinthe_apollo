//

import observerNotifyAll from './observer/notifyAll.js'

const notifyActive = (notifier, event) => {
  observerNotifyAll(notifier.activeObservers, event)

  return notifier
}

export default notifyActive
