//

import { getOperationType } from '@jumpn/utils-graphql'

import requestStatuses from './requestStatuses.js'

const createUsing = (request, operationType) => ({
  operationType,
  request,
  activeObservers: [],
  canceledObservers: [],
  isActive: true,
  requestStatus: requestStatuses.pending,
  subscriptionId: undefined
})

const create = (request) =>
  createUsing(request, getOperationType(request.operation))

export default create
