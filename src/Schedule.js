import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import GlobalContext from "./context/GlobalContext";
import './styles/styles.css';  // CSS スタイルをインポート

const Schedule = () => {
  const { savedEvents, daySelected } = useContext(GlobalContext);
  const [todayEvents, setTodayEvents] = useState([]);

  useEffect(() => {
    // 選択された日に予定されているイベントをフィルタリング
    const eventsForDay = savedEvents.filter(event =>
      dayjs(event.day).format("YYYY-MM-DD") === daySelected.format("YYYY-MM-DD")
    );
    setTodayEvents(eventsForDay);
  }, [daySelected, savedEvents]);



  return (
    <div className="timeline">
      {Array.from({ length: 24 }).map((_, index) => (
        <div key={index} className="hour">{`${index}:00`}</div>
      ))}
      
    </div>
  );
};

export default Schedule;
