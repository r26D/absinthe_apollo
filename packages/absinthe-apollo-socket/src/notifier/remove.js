//

import { arrayRemove } from '@r26d/utils-graphql'

import findIndex from './findIndex.js'

const remove = (notifier) => (notifiers) =>
  arrayRemove(findIndex(notifiers, 'request', notifier.request), 1, notifiers)

export default remove
