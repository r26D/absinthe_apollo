//

import { compositeHasIn } from '@r26d/utils-graphql'

const find = (notifiers, key, value) =>
  // $FlowFixMe: flow is having some troubles to match hasIn signature (curry)
  notifiers.find(compositeHasIn([key], value))

export default find
