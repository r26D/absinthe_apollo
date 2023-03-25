//

import {  arrayReplace } from '@r26d/utils-graphql'

import findIndex from './findIndex.js'

const refresh = (notifier) => (notifiers) =>
  arrayReplace(
    findIndex(notifiers, 'request', notifier.request),
    [notifier],
    notifiers
  )

export default refresh
