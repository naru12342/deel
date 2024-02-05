//Globalcintext.js
import React, { createContext } from "react";


const GlobalContext = createContext({
  monthIndex: 0,
  setMonthIndex: (index) => {},
  daySelected: null,
  setDaySelected: (day) => {},
  eventTime: null,
  setEventTime: () => {},
  showEventModal: false,
  setShowEventModal: () => {},
  dispatchCalEvent: ({ type, payload }) => {},
  savedEvents: [],
  selectedEvent: null,
  setSelectedEvent: () => {},
  
  
});

export default GlobalContext;