//      

import {getOperationType} from "@jumpn/utils-graphql";

                                                                            

import SubscriptionClient from "./SubscriptionsClient";

const parseIfJson = text => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
};

const responseToText = response => response.text();

const postJson = (url        , body        )                  =>
  fetch(url, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    credentials: "include"
  })
    .then(responseToText)
    .then(parseIfJson);

const getSubscribeCallback = observer => (error, result) => {
  if (error) {
    observer.error(error);
  } else {
    observer.next(result);
  }
};

const subscribeWithObservable = (
  state,
  subscriptionsClient,
  subscriptionSentMessage,
  gqlRequestCompat
) => ({
  subscribe: (observer                                   ) => {
    observer.next(subscriptionSentMessage);

    state.activeSubscriptionId = subscriptionsClient.subscribe(
      gqlRequestCompat,
      getSubscribeCallback(observer)
    );
  }
});

/**
 * Creates a Fetcher using the given arguments
 */
const createFetcher = (
  apiUrl        ,
  subscriptionsClient                    ,
  subscriptionSentMessage        
) => {
  const state = {activeSubscriptionId: undefined};

  return (gqlRequestCompat                       ) => {
    if (state.activeSubscriptionId) {
      subscriptionsClient.unsubscribe(state.activeSubscriptionId);
    }

    return getOperationType(gqlRequestCompat.query) !== "subscription"
      ? postJson(apiUrl, gqlRequestCompat)
      : subscribeWithObservable(
          state,
          subscriptionsClient,
          subscriptionSentMessage,
          gqlRequestCompat
        );
  };
};

export default createFetcher;
