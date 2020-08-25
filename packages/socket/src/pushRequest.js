//      

                                                                       

import notifierNotifyResultEvent from "./notifier/notifyResultEvent";
import notifierNotifyStartEvent from "./notifier/notifyStartEvent";
import notifierRemove from "./notifier/remove";
import pushRequestUsing from "./pushRequestUsing";
import refreshNotifier from "./refreshNotifier";
import requestStatuses from "./notifier/requestStatuses";
import updateNotifiers from "./updateNotifiers";
import {subscribe} from "./subscription";

                                            
                                               

const setNotifierRequestStatusSent = (absintheSocket, notifier) =>
  refreshNotifier(absintheSocket, {
    ...notifier,
    requestStatus: requestStatuses.sent
  });

const onQueryOrMutationSucceed = (
  absintheSocket                ,
  notifier                    ,
  response                  
) =>
  updateNotifiers(
    absintheSocket,
    notifierRemove(
      notifierNotifyResultEvent(
        setNotifierRequestStatusSent(absintheSocket, notifier),
        response
      )
    )
  );

const pushQueryOrMutation = (absintheSocket, notifier) =>
  pushRequestUsing(
    absintheSocket,
    notifierNotifyStartEvent(notifier),
    onQueryOrMutationSucceed
  );

const pushRequest = (
  absintheSocket                ,
  notifier                    
) => {
  if (notifier.operationType === "subscription") {
    subscribe(absintheSocket, notifier);
  } else {
    pushQueryOrMutation(absintheSocket, notifier);
  }
};

export default pushRequest;
