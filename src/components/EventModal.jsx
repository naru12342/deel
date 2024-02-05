//eventModal.js
import React, { useState, useContext, useEffect, useRef } from "react";

import GlobalContext from "../context/GlobalContext";
import axios from 'axios';
import dayjs from 'dayjs';
import Icon from '../icon/Icon.svg';
import leftbackIcon from '../icon/leftbackIcon.svg';
import Icon2 from '../icon/+.svg';
import articon from '../icon/articon.png';



import { useNavigate} from 'react-router-dom';



export const EventModal = () => {
  const [savedConversations, setSavedConversations] = useState([]);
  const [showConversationsModal, setShowConversationsModal] = useState(false);
  const { daySelected, setShowEventModal, dispatchCalEvent, selectedEvent } =
    useContext(GlobalContext);
  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const modalRef = useRef(); // モーダルへの参照
  const [message] = useState('');
  const [selectedRoleText, setSelectedRoleText] = useState('');
const [eventStartTime, setEventStartTime] = useState(null);
const [eventEndTime, setEventEndTime] = useState(null);
  


  useEffect(() => {
    const fetchSavedConversations = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/conversations');
        const filteredConversations = response.data.filter(
          (conv) => dayjs(conv.createdAt).format("YYYY-MM-DD") === daySelected.format("YYYY-MM-DD")
        );
        setSavedConversations(filteredConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchSavedConversations();
  }, [daySelected]);
  
  

  useEffect(() => {
    // モーダル外のクリックを検出するイベントリスナー
    const clickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowEventModal(false); // モーダルを閉じる
      }
    };
  
    // イベントリスナーをドキュメントに追加
    document.addEventListener("mousedown", clickOutside);
  
    return () => {
      // クリーンアップ（コンポーネントがアンマウントされるときにイベントリスナーを削除）
      document.removeEventListener("mousedown", clickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setEventStartTime(selectedEvent.start);
      setEventEndTime(selectedEvent.end);
    } else {
      setTitle('');
      setEventStartTime(null);
      setEventEndTime(null);
    }
  }, [selectedEvent]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const calendarEvent = {
      title: title,
      start: eventStartTime,
      end: eventEndTime,
      day: daySelected.valueOf(),
      id: selectedEvent ? selectedEvent.id : Date.now(),
    };
    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: calendarEvent });
    } else {
      dispatchCalEvent({ type: "push", payload: calendarEvent });
    }
    setShowEventModal(false);
  };
  
  const handleRefresh = () => {
    window.location.reload();
  };
  // 特定の会話を消去する関数
  const handleDeleteConversation = async (conversationId) => {
    try {
      await axios.delete(`http://localhost:3002/api/conversations/${conversationId}`);
      setSavedConversations(savedConversations.filter(conv => conv._id !== conversationId));
      setSelectedConversation(null); // これによりモーダルが閉じる
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };
  // 会話を選択する関数
const selectConversation = (conversation) => {
  navigate('/NewChat', { state: { selectedConversation: conversation } });
};
let navigate = useNavigate();


return (
  <div className=" fixed inset-0 flex justify-center items-center m-4">
  <div className="toumei rounded-lg shadow-2xl w-[500px] h-[600px] overflow-auto">
    {/* モーダルコンテンツ */}<div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundImage: `url(${process.env.PUBLIC_URL}/talk.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      </div>
      <header className="px-4 py-1 flex items-center justify-between toumei">
  <div className="flex items-center">
    <button type="button" className="opacity-60 w-7 h-7" onClick={() => setShowEventModal(null)}>
      <img src={leftbackIcon} alt="leftbackIcon" />
    </button>
    <p className="ml-1 text-white opacity-80 text-md">{daySelected.format("MMMM DD日 (dd)")}</p>
  </div>

  
</header>

        <div className="p-3">
  <div className="flex items-end gap-4">
    <input
      type="text"
      name="title"
      placeholder="Add title"
      value={title}
      required
      className="pt-3 text-sm border-0 text-white opacity-70 text-xl font-semibold pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-Redpink bg-transparent flex-grow"
      onChange={(e) => setTitle(e.target.value)}
    />
 

  <div style={{
      position: 'fixed', // コンテナを固定位置に
      right: '10%', // 右端から10%の位置に
      display: 'flex', // ボタンを横並びにする
      gap: '10px', // ボタン間の間隔を設定
    }}
  >
    {selectedEvent && (
      <button
        className="opacity-60 mt-2 w-5 h-5" // 消去ボタンのスタイル
        onClick={() => {
          dispatchCalEvent({ type: "delete", payload: selectedEvent });
          setShowEventModal(false);
        }}
      >
        <img src={Icon} alt="Icon" className="w-full h-full" />
      </button>
    )}
    <button
      type="submit"
      onClick={handleSubmit}
      className="bg-Redpink2 text-sm hover:bg-Redpink px-6 py-2 rounded text-white"
    >
      Save
    </button>
  </div>




    <div className="p-3">
  <div className="flex flex-col gap-4 clock">
   
  </div>
</div>
  </div>
</div>
<div>
<div className="p-3">
  <div>
    <label>開始時間: </label>
    <input
      type="time"
      value={eventStartTime}
      onChange={(e) => setEventStartTime(e.target.value)}
      style={{
        backgroundColor: 'transparent', // 背景色を透明に設定
        border: 'none', // ボーダーを削除
        outline: 'none', // フォーカス時のアウトラインを削除
        color: 'white', // 文字色を白に設定（必要に応じて調整）
      }}
    />
  </div>
  <div>
    <label>終了時間: </label>
    <input
      type="time"
      value={eventEndTime}
      onChange={(e) => setEventEndTime(e.target.value)}
      style={{
        backgroundColor: 'transparent', // 背景色を透明に設定
        border: 'none', // ボーダーを削除
        outline: 'none', // フォーカス時のアウトラインを削除
        color: 'white', // 文字色を白に設定（必要に応じて調整）
      }}
    />
  </div>
</div>

    </div>
        
          <p className="ml-3 mt-3 text-white opacity-60">日記履歴</p>
          <div className="text-white smallfont2 opacity-60 m-2">
          {savedConversations.map((conversation, index) => (
  <div 
    key={index} 
    onClick={() => setSelectedConversation(conversation)}
    className="cursor-pointer m-3 border-b border-white border-opacity-20"
  >
   {conversation.messages.length > 0 && (
  <p>
    {conversation.messages[0].text.length > 22
      ? conversation.messages[0].text.slice(0, 22) + '...'
      : conversation.messages[0].text}
  </p>
)}

    
    {conversation.summary && (
      <p className="summary-text">{conversation.summary}</p>
    )}
  </div>
))}

</div>


{selectedConversation && (
  <div className=" fixed inset-0 flex justify-center items-center m-4">
  <div className="toumei rounded-lg shadow-2xl w-[900px] h-[600px] overflow-auto">
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      backgroundImage: `url(${process.env.PUBLIC_URL}/talk.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      </div>
  <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      backgroundImage: `url(${process.env.PUBLIC_URL}/talk.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      </div>
      <header className="px-4 py-1 flex items-center justify-between toumei" > {/* justify-end を削除 */}
  <div className="flex items-center"> 
      <button type="button" className="opacity-60  w-7 h-7 " onClick={() =>setSelectedConversation(false)}>
      <img  src={leftbackIcon} alt="leftbackIcon" />
      </button>
    <p className="ml-1  text-white opacity-80 text-md">{daySelected.format("MMMM DD日 (dd)")}</p>
    </div>
    <div className="flex">
    <button  type="button" onClick={() => handleDeleteConversation(selectedConversation._id)} className="delete-button opacity-60  w-6 h-6">
               <img src={Icon} alt="Icon" />
               </button>
               <button type="button" onClick={() => selectConversation(selectedConversation)} className="select-button opacity-60  w-6 h-6">
               <img src={Icon2} alt="+" />
    </button>
    {selectedRoleText && (
          <p className="text-white opacity-80 text-md ml-auto">Selected Role: {selectedRoleText}</p>
        )}
  </div>
</header>

      <div className="conversation-history smallfont2">
     
    {selectedConversation.messages.map((message, messageIndex) => (
  <div key={messageIndex} className={` ${message.type === 'user' ? '' : 'bot-message-container'}`}>
    {message.type === 'bot' && <div className="icon-bot"></div>}
   
    <div className={`message-box ${message.type === 'user' ? 'user-message' : 'bot-message'}`}>
      <p><b>{message.type === 'user' ? ' ' : ''}</b>{message.text}</p>
      {message.type === 'user' && <div className="icon-bot2"></div>}
    </div>
  </div>
))}
</div>
              
      
  
     

    </div>
  </div>
)}
       
      
      </div>
    </div>
    
  );
};