//      

import notifyActive from "./notifyActive";
import {createStartEvent} from "./event/eventCreators";

                                      

const notifyStartEvent =                                   (
  notifier                             
) => notifyActive(notifier, createStartEvent(notifier));

export default notifyStartEvent;
