const mapObject = (mapper, object) =>
  Object.entries(object).reduce(
    (result, [key, value]) => ({
      ...result,
      [key]: mapper(value, key, object)
    }),
    {}
  )

/**
 * Maps values of the given composite using mapper
 */
const compositeMap = (
  mapper,
  composite
) => {
  if (composite === undefined) {
    throw 'compositeMap is no longer curried -you must provide two arguments to this function'
  }
  return Array.isArray(composite)
    ? composite.map(mapper)
    : mapObject(mapper, composite)

}

export default compositeMap