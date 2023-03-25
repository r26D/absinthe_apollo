import isEqual from 'lodash.isequal'

const isLastIndex = (array, index) =>
  index === array.length - 1


const isObject = thing => thing !== null && typeof thing === 'object'
const isComposite = (thing) => Array.isArray(thing) || isObject(thing)

/**
 * Get property value of given key.
 */
const get = (key, composite) => composite[(key)]
const getInIfNeeded = (index, path, value) =>
  isLastIndex(path, index) ? value : getInRecur(index + 1, path, value)

const getNotCompositeErrorMessage = (index, path, maybeComposite) =>
  `Expected to find a composite at [${path.join(', ')}][${index}], ` +
  `but instead got: ${typeof maybeComposite}`

const ensureIsComposite = (index, path, maybeComposite) => {
  if (isComposite(maybeComposite)) return maybeComposite

  throw new Error(getNotCompositeErrorMessage(index, path, maybeComposite))
}

const getInRecur = (index, path, maybeComposite) =>
  maybeComposite === undefined
    ? undefined
    : getInIfNeeded(
      index,
      path,
      get(path[index], ensureIsComposite(index, path, maybeComposite))
    )

/**
 * Returns value located at the given path or undefined otherwise.
 */
const getIn = (path, composite) =>
  path.length === 0 ? undefined : getInRecur(0, path, composite)


/**
 * Returns true if value located at given path is deeply equal to the one
 * specified.
 */
const compositeHasInFn = (path, value, composite) =>
  isEqual(getIn(path, composite), value)


//Original code used curry to do this - but i'm removing the dep
const compositeHasIn = (path, value, composite) => {
  if (value === undefined && composite === undefined) {
    return (v, c) => compositeHasInFn(path, v, c)
  }
  if (composite === undefined) {
    return (c) => compositeHasInFn(path, value, c)
  }
  return compositeHasInFn(path, value, composite)
}
export default compositeHasIn
