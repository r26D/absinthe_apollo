//

import { compositeHasIn } from '@r26d/utils-graphql'

const findIndex = (notifiers, key, value) =>
  // $FlowFixMe: flow is having some troubles to match hasIn signature (curry)
  notifiers.findIndex(compositeHasIn([key], value))

export default findIndex
