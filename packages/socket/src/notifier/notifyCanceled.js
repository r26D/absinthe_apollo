//

import observerNotifyAll from './observer/notifyAll'

const notifyCanceled = (notifier, event) => {
  observerNotifyAll(notifier.canceledObservers, event)

  return notifier
}

export default notifyCanceled
