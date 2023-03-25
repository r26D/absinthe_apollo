const operationTypeRe = /^\s*(query|mutation|subscription|\{)/;

const getOperationTypeFromMatched = (matched) =>
    matched === "{" ? "query" : matched;

/**
 * Returns the type (query, mutation, or subscription) of the given operation
 *
 * @example
 *
 * const operation = `
 *   subscription userSubscription($userId: ID!) {
 *     user(userId: $userId) {
 *       id
 *       name
 *     }
 *   }
 * `;
 *
 * const operationType = getOperationType(operation);
 *
 * console.log(operationType); // "subscription"
 */
const getOperationType = (operation) => {
    const result = operation.match(operationTypeRe);

  if (!result) {
      throw new TypeError(`Invalid operation:\n${operation}`);
    }

    return getOperationTypeFromMatched(result[1]);
};

export default getOperationType;
