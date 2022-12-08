//

import notifierObserve from './notifier/observe.js'
import refreshNotifier from './refreshNotifier.js'

/**
 * Observes given notifier using the provided observer
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket"
 *
 * const logEvent = eventName => (...args) => console.log(eventName, ...args);
 *
 * const updatedNotifier = withAbsintheSocket.observe(absintheSocket, notifier, {
 *   onAbort: logEvent("abort"),
 *   onError: logEvent("error"),
 *   onStart: logEvent("open"),
 *   onResult: logEvent("result")
 * });
 */
const observe = (absintheSocket, notifier, observer) =>
  refreshNotifier(absintheSocket, notifierObserve(notifier, observer))

export default observe
