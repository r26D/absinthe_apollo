//      

import {observe, send} from "@absinthe/socket";

                                                     
                                               

/**
 * Creates a Fetcher (Relay FetchFunction) using the given AbsintheSocket
 * instance
 */
const createFetcher = (
  absintheSocket                ,
  onError                        
)                => ({text: operation}, variables) =>
  new Promise((resolve, reject) =>
    // $FlowFixMe: operation is always defined
    observe(absintheSocket, send(absintheSocket, {operation, variables}), {
      onError,
      onAbort: reject,
      onResult: resolve
    })
  );

export default createFetcher;
