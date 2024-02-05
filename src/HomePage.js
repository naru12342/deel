// src/HomePage.js
import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import GlobalContext from "./context/GlobalContext";
import { useNavigate } from 'react-router-dom';
import Schedule from './Schedule'; // 正しいパスに修正してください
import './styles/styles.css'; 
import NewChatIcon from './icon/NewChatIcon.svg';
import calenderIcon from './icon/calenderIcon.svg';
import { getEventStyle } from './getEventStyle'; 

const HomePage = () => {
  let navigate = useNavigate();
  const { savedEvents, daySelected, setDaySelected } = useContext(GlobalContext);
  const [todayEvents, setTodayEvents] = useState([]);
  const [showBackground, setShowBackground] = useState(true);

const handleNewChat = () => {
  navigate('/choose');
};

  const handlecalender = () => {
    navigate('/calendar');
  };
  // 日付が変更されたときに予定を更新する
  useEffect(() => {
    const eventsForDay = savedEvents.filter(event =>
      dayjs(event.day).format("YYYY-MM-DD") === dayjs(daySelected).format("YYYY-MM-DD")
    );
    setTodayEvents(eventsForDay);
  }, [daySelected, savedEvents]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackground(window.scrollY <= 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePrevDay = () => {
    setDaySelected(dayjs(daySelected).subtract(1, "day"));
  };

  const handleNextDay = () => {
    setDaySelected(dayjs(daySelected).add(1, "day"));
  };

  const handleToday = () => {
    setDaySelected(dayjs());
  };

  useEffect(() => {
    // 選択された日に予定されているイベントをフィルタリング
    const eventsForDay = savedEvents.filter(event =>
      dayjs(event.day).format("YYYY-MM-DD") === daySelected.format("YYYY-MM-DD")
    );
    setTodayEvents(eventsForDay);
  }, [daySelected, savedEvents]);

  return (
    <div>
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundImage: `url(${process.env.PUBLIC_URL}/en.png), url(${process.env.PUBLIC_URL}/memory.png)`,
        backgroundSize: 'cover, cover',
        backgroundPosition: 'top center, center',
        backgroundRepeat: 'no-repeat',
      }}></div>
      <header className="flex items-center">
        
      <div className="flex items-center">
        {/* コメントアウトされたテキスト */}
      </div>
      <div className="flex">
        <button className="m-2 opacity-40" onClick={handlecalender}>
          <img src={calenderIcon} alt="calenderIcon" />
        </button>
        <button className=" opacity-40 " onClick={handleNewChat}>
          <img src={NewChatIcon} alt="NewChatIcon" />
        </button>
        
      </div>
    </header>
    
    <div style={{ width: '100%', overflowY: 'auto' }}>
        <img src={`${process.env.PUBLIC_URL}/home3.png`} alt="Home" style={{ width: '100%', objectFit: 'cover'}} /> 
  </div>
  <div>
        Today is {dayjs(daySelected).format('YYYY-MM-DD')}.
      </div>
      <div className="home">
        <h2>予定 ({dayjs(daySelected).format("YYYY-MM-DD")})</h2>
        <div>
          <button onClick={handlePrevDay}>前の日</button>
          <button onClick={handleToday}>今日</button>
          <button onClick={handleNextDay}>次の日</button>
        </div>
        <div className="timeline">
      {todayEvents.map((event, index) => (
        // ここで getEventStyle を呼び出してスタイルを適用
        <div
          key={index}
          className="event"
          style={getEventStyle(event)} // ここで計算されたスタイルを適用
        >
          <div className="event-title">{event.title}</div>
          <div className="event-time">
            {dayjs(event.start).format("HH:mm")} - {dayjs(event.end).format("HH:mm")}
          </div>
        </div>
      ))}
    </div>
       

      <div className="events-today">
        {todayEvents.length > 0 ? (
          todayEvents.map((event, index) => (
            <div key={index} className="event">
              <div className="event-time">
                {dayjs(event.start).format("HH:mm")} - {dayjs(event.end).format("HH:mm")}
              </div>
              <div className="event-title">{event.title}</div>
            </div>
          ))
        ) : (
          <p>この日の予定はありません。</p>
        )}
         <Schedule events={todayEvents} />
      </div>
    </div>
    </div>
  );
};

export default HomePage;