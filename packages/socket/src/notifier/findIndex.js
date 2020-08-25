//

import { hasIn } from '@jumpn/utils-composite'

const findIndex = (notifiers, key, value) =>
  // $FlowFixMe: flow is having some troubles to match hasIn signature (curry)
  notifiers.findIndex(hasIn([key], value))

export default findIndex
