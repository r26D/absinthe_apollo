import cancel from './cancel.js'
import unobserve from './unobserve.js'

const doUnobserveOrCancel = (absintheSocket, notifier, observer) =>
  notifier.activeObservers.length === 1
    ? cancel(absintheSocket, notifier)
    : unobserve(absintheSocket, notifier, observer)

/**
 * Cancels notifier if there are no more observers apart from the one given, or
 * detaches given observer from notifier otherwise
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.unobserve(absintheSocket, notifier, observer);
 */
const unobserveOrCancel = (absintheSocket, notifier, observer) =>
  notifier.isActive
    ? doUnobserveOrCancel(absintheSocket, notifier, observer)
    : absintheSocket

export default unobserveOrCancel
