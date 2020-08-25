//      

import absintheEventNames from "./absintheEventNames";

                                                                        

const createAbsintheUnsubscribeEvent = (
  payload                                                   
)                           => ({
  payload,
  name: absintheEventNames.unsubscribe
});

const createAbsintheDocEvent =                           (
  payload                                                      
)                              => ({
  payload,
  name: absintheEventNames.doc
});

export {createAbsintheDocEvent, createAbsintheUnsubscribeEvent};
