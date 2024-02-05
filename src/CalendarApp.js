//calenderApp.js
import React, { useState, useEffect, useContext } from "react";
import { getMonth } from "./util";
import { CalendarHeader } from "./components/CalendarHeader";
import { Sidebar } from "./components/Sidebar";
import { Month } from "./components/Month";
import GlobalContext from "./context/GlobalContext";
import { EventModal } from "./components/EventModal";


function CalendarApp() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal } = useContext(GlobalContext);
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];
 
  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <>
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      backgroundImage: `url(${process.env.PUBLIC_URL}/memory.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
    </div>
    <div className="h-screen flex flex-col">
      {/* CalendarHeader は EventModal の後に配置 */}
      <CalendarHeader />
      <div className="flex  smallfont0 text-white">
      {weekDays.map((day, index) => (
        <div key={index} className="flex-1 text-center py-1">
          {day}
        </div>
      ))}
    </div>
      <div className="flex flex-1">
        <Sidebar />
        <Month month={currentMonth} />
      </div>
      
    </div>
    {/* EventModal を CalendarHeader の上に配置 */}
    {showEventModal && <EventModal />}

    
    </>
  );
}

export default CalendarApp;
