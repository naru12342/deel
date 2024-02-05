import React from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Week } from "./Week";
import leftbackIcon from './icon/leftbackIcon.svg';
import { useNavigate} from 'react-router-dom';

const WeekPage = () => {
  const { startDate } = useParams();
  const startDay = dayjs(startDate);
  const week = Array.from({ length: 7 }, (_, i) => startDay.add(i, 'day'));
  const Gocalender = () => {
    navigate('/calendar');
};
  let navigate = useNavigate();
  
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
    <button type="button" className="opacity-60  w-7 h-7 " onClick={Gocalender}>
      <img  src={leftbackIcon} alt="leftbackIcon" />
      </button>
    <div>
      <Week week={week} />
    </div>
   </>
  );
};

export default WeekPage;