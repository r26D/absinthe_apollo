//

import { replace as arrayReplace } from '@jumpn/utils-array'

import findIndex from './findIndex.js'

const refresh = (notifier) => (notifiers) =>
  arrayReplace(
    findIndex(notifiers, 'request', notifier.request),
    [notifier],
    notifiers
  )

export default refresh
