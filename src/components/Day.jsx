//Day.js
import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import GlobalContext from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";



export const Day = (props) => {
  const { rowIdx } = props;
  const [dayEvents, setDayEvents] = useState([]);
  const { setDaySelected, setShowEventModal, savedEvents, setSelectedEvent } =
    useContext(GlobalContext);

    const navigate = useNavigate();
      const { day } = props;

      const handleDayClick = () => {
        const startOfWeek = day.startOf('week').format("YYYY-MM-DD");
        navigate(`/week/${startOfWeek}`);
      };

  // 今日の日付を色付けする
  const getCurrentDayClass = () => {
    return day.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
      ? "bg-Redpink text-white rounded-full w-7"
      : "";
  };

  // 登録データを日付が一致する日に表示
  useEffect(() => {
    const events = savedEvents.filter(
      (evt) => dayjs(evt.day).format("YYYY-MM-DD") === day.format("YYYY-MM-DD")
    );
    setDayEvents(events);
  }, [savedEvents, day]);

  return (
   
      
    <div className="border border-white flex flex-col day-border">
    <div className="day" onClick={handleDayClick}>
    <header className="flex flex-col items-center relative">
 
  <div className="flex justify-center items-center w-full">
    <p className={`smallfont2 p-1 text-white text-center ${getCurrentDayClass()}`}>
      {day.format("DD")}
    </p>
    {/* 日記履歴がある場合に赤丸を表示 */}
    {dayEvents.length > 0 && (
      <span className="bg-red-500 rounded-full w-1 h-1 absolute right-2 top-2 transform translate-x-1/2 -translate-y-1/2"></span>
    )}
  </div>
</header>

      </div>
      
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(day);
          setShowEventModal(true);
        }}
        
      >
      {dayEvents.map((evt, idx) => (
  <div
    key={idx}
    onClick={() => setSelectedEvent(evt)}
    className="bg-neutral-200 mr-1 toumei2 smallfont0 rounded mb-0.5 truncate event-text">
    <span className="ml-1">{evt.title}</span>
  </div>
))}

        
      </div>
    </div>
    
  );
};