//      

import flushCanceled from "./flushCanceled";
import requestStatuses from "./requestStatuses";

                                      

const reset =                                   (
  notifier                             
) =>
  flushCanceled({
    ...notifier,
    isActive: true,
    requestStatus: requestStatuses.pending,
    subscriptionId: undefined
  });

export default reset;
