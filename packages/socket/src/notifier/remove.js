//      

import {remove as arrayRemove} from "@jumpn/utils-array";

import findIndex from "./findIndex";

                                      

const remove = (notifier                    ) => (
  notifiers                           
) =>
  arrayRemove(findIndex(notifiers, "request", notifier.request), 1, notifiers);

export default remove;
