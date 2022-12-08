import notifierRefresh from './notifier/refresh.js'
import notifierUnobserve from './notifier/unobserve.js'
import updateNotifiers from './updateNotifiers.js'

const ensureHasActiveObserver = (notifier, observer) => {
  if (notifier.activeObservers.includes(observer)) return notifier

  throw new Error('Observer is not attached to notifier')
}

/**
 * Detaches observer from notifier
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.unobserve(absintheSocket, notifier, observer);
 */
const unobserve = (absintheSocket, notifier, observer) =>
  updateNotifiers(
    absintheSocket,
    notifierRefresh(
      notifierUnobserve(ensureHasActiveObserver(notifier, observer), observer)
    )
  )

export default unobserve
