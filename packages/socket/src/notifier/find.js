//      

import {hasIn} from "@jumpn/utils-composite";

                                      

const find = (notifiers                           , key        , value     ) =>
  // $FlowFixMe: flow is having some troubles to match hasIn signature (curry)
  notifiers.find(hasIn([key], value));

export default find;
