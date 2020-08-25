//

import { replace as arrayReplace } from '@jumpn/utils-array'

import findIndex from './findIndex'

const refresh = (notifier) => (notifiers) =>
  arrayReplace(
    findIndex(notifiers, 'request', notifier.request),
    [notifier],
    notifiers
  )

export default refresh
