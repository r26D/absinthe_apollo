//

import flushCanceled from './flushCanceled.js'
import requestStatuses from './requestStatuses.js'

const reset = (notifier) =>
  flushCanceled({
    ...notifier,
    isActive: true,
    requestStatus: requestStatuses.pending,
    subscriptionId: undefined
  })

export default reset
