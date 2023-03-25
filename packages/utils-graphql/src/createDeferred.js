/**
 * Creates a Deferred
 */
const createDeferred = () => {
  const deferred = {}

  deferred.promise = new Promise((resolve, reject) =>
    Object.assign(deferred, { resolve, reject })
  )
  return (deferred)
}

export default createDeferred