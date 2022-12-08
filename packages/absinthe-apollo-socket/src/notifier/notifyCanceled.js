//

import observerNotifyAll from './observer/notifyAll.js'

const notifyCanceled = (notifier, event) => {
  observerNotifyAll(notifier.canceledObservers, event)

  return notifier
}

export default notifyCanceled
