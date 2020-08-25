//      

import {Push} from "phoenix";

                                         

const handlePush = (push      , handler                  ) =>
  push
    .receive("ok", handler.onSucceed)
    .receive("error", handler.onError)
    .receive("timeout", handler.onTimeout);

export default handlePush;
