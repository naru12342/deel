//CalenderHeader.js
import dayjs from "dayjs";
import React, { useContext } from "react";
import { useNavigate} from 'react-router-dom';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import GlobalContext from "../context/GlobalContext";
import LordIcon from '../icon/LordIcon.svg';
import homeIcon from '../icon/homeIcon.svg';
import NewChatIcon from '../icon/NewChatIcon.svg';
import ja from "dayjs/locale/ja";
dayjs.locale(ja);


export const CalendarHeader = () => {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  let navigate = useNavigate();
  const GoChat = () => {
    navigate( '/choose');
  };
  const GoHome = () => {
    navigate('/');
  };
  const handlePrevMonth = () => {
    setMonthIndex(monthIndex - 1);
  };
  const handelNextMonth = () => {
    setMonthIndex(monthIndex + 1);
  };
  const handleReset = () => {
    // 現在の月を取得
    setMonthIndex(dayjs().month());
  };
  return (
    <header className="px-4  flex items-center justify-between">
      <div className="flex items-center">
      
        <button onClick={handlePrevMonth}>
          <span className="cursor-pointer text-white opacity-60  ">
            <MdChevronLeft />
          </span>
        </button>
      <h2 className="ml-1 smallfont1 text-white ">
          {dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY年 MMMM ")}
        </h2>
        
        <button onClick={handelNextMonth}>
          <span className="cursor-pointer text-white m-3 opacity-60 mx-5">
            <MdChevronRight />
          </span>
        </button>
        
        <button onClick={handleReset} className="opacity-60 m-1 mt-1">
          <img src={LordIcon} alt="LordIcon" className="w-3 h-3" />
        </button>
      </div>
      
      <div className="flex">
      <button className="m-2 opacity-40 w-4 h-4" onClick={GoHome}>
          <img src={homeIcon} alt="homeIcon" />
        </button>
        <button className="m-2 opacity-40 w-4 h-4" onClick={GoChat}>
          <img src={NewChatIcon} alt="NewChatIcon" />
        </button>
      </div>
    </header>
  );
  }  