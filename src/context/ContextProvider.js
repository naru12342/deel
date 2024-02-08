// ContextProvider.js
import React, { useReducer } from "react";
import GlobalContext from "./GlobalContext";

const saveEventsReducer = (state, action) => {
  switch (action.type) {
    // レデューサーロジック
    default:
      return state;
  }
};

const initEvents = [];

const ContextProvider = ({ children }) => {
  const [savedEvents, dispatchCalEvent] = useReducer(saveEventsReducer, initEvents);

  return (
    <GlobalContext.Provider
      value={{
        // 状態や関数をここに配置
        savedEvents,
        dispatchCalEvent,
        // 他の状態やセッター関数も同様
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
