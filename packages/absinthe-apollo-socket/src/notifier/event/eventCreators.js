//

import eventNames from './eventNames.js'

const createStartEvent = (payload) => ({ payload, name: eventNames.start })

const createResultEvent = (payload) => ({
  payload,
  name: eventNames.result
})

const createErrorEvent = (payload) => ({
  payload,
  name: eventNames.error
})

const createCancelEvent = () => ({
  name: eventNames.cancel,
  payload: undefined
})

const createAbortEvent = (payload) => ({
  payload,
  name: eventNames.abort
})

export {
  createStartEvent,
  createResultEvent,
  createErrorEvent,
  createCancelEvent,
  createAbortEvent
}
