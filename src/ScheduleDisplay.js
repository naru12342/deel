//ScheduleDisplay
import React, { useContext } from 'react';
import GlobalContext from './context/GlobalContext';
import './styles/styles.css'; // CSS スタイルをインポート

const ScheduleDisplay = () => {
  const { savedEvents } = useContext(GlobalContext);

  // 保存されたイベントが一つもない場合に時刻軸の上部に表示するメッセージ
  if (savedEvents.length === 0) {
    return (
      <div className="timeline">
        <div className="no-events">イベントがありません</div>
      </div>
    );
  }

  return (
    <div className="timeline">
      {Array.from({ length: 24 }, (_, i) => i).map(hour => (
        <div key={hour} className="hour">
          {`${hour}:00`}
          {savedEvents.map((event, index) => {
            const eventStartHour = parseInt(event.start.split(':')[0], 10);
            if (hour === eventStartHour) {
              const duration = parseInt(event.end.split(':')[0], 10) - eventStartHour;
              const eventStyle = {
                top: `${hour * 50}px`,
                height: `${duration * 50}px`,
                width: '200px', // イベントの幅
              };
              return (
                <div key={index} className="event" style={eventStyle}>
                  {event.title}
                </div>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default ScheduleDisplay;
