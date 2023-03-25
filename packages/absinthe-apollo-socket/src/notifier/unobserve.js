//

import { arrayRemove } from '@r26d/utils-graphql'

const removeObserver = (observers, observer) =>
  arrayRemove(observers.indexOf(observer), 1, observers)

const unobserve = ({ activeObservers, ...rest }, observer) => ({
  ...rest,
  activeObservers: removeObserver(activeObservers, observer)
})

export default unobserve
