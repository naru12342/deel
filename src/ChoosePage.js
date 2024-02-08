import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Modal from './modal'; // 既存のModalコンポーネントをインポート
import calenderIcon from './icon/calenderIcon.svg';
import homeIcon from './icon/homeIcon.svg';
import { getEventStyle } from './getEventStyle'; 
import dayjs from "dayjs";
import GlobalContext from "./context/GlobalContext";
import Schedule from './Schedule'; 

// キャラクターの画像パスをマッピング
const characterImages = {
  'A': `${process.env.PUBLIC_URL}/Eicon.png`, // エンジニアの画像パス
  'B': `${process.env.PUBLIC_URL}/Gicon.png`, // ギャルの画像パス
  'C': `${process.env.PUBLIC_URL}/Ficon.png`, // 娘を愛でる父の画像パス
};

const ChoosePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [confirmationContent, setConfirmationContent] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const { savedEvents, daySelected, setDaySelected } = useContext(GlobalContext);
  const [todayEvents, setTodayEvents] = useState([]);
  let navigate = useNavigate();
    // 日付が変更されたときに予定を更新する
    useEffect(() => {
      const eventsForDay = savedEvents.filter(event =>
        dayjs(event.day).format("YYYY-MM-DD") === dayjs(daySelected).format("YYYY-MM-DD")
      );
      setTodayEvents(eventsForDay);
    }, [daySelected, savedEvents]);

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

// モーダルのスタイル調整
const modalStyle = {
    position: 'absolute',
    top: '30%', // ページの中央に近づける
    left: '50%',
    transform: 'translate(-50%, -50%)', // 正確に中央に配置
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '80%',
    zIndex: 1050, // 必要に応じてz-indexを設定
  };
  
  // 画像のスタイルはそのままで、モーダルの位置を調整する
  

  const characterNames = {
    'A': 'エンジニアの25歳男性',
    'B': 'ギャル22歳女性',
    'C': '娘を愛でる父'
  };

  // ランダム選択ボタンのクリックイベントハンドラ
  const handleRandomSelect = () => {
    const characters = ['A', 'B', 'C'];
    const randomRole = characters[Math.floor(Math.random() * characters.length)];
    setSelectedRole(randomRole);
    setConfirmationContent(`${characterNames[randomRole]}`);
    setSelectedImage(characterImages[randomRole]); // 選択されたキャラクターの画像を設定
    setIsModalOpen(true);
  };

  // handleSelectRole関数の例（修正版）
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    navigate('/chat', { state: { role: role } }); // 直接選択時はモーダルを表示せずに遷移
  };

  const handleNavigateToChat = () => {
    navigate('/chat', { state: { role: selectedRole } });
  };
      
      const confirmationModalContent = (
        <div style={{
          ...modalStyle,
          backgroundColor: 'rgba(220, 220, 220, 0.958)',
        //   position: 'relative', // これにより、z-indexがこのコンテナ内でのみ適用される
          width: '300px',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          {/* "選ばれたのは・・・"のテキストを左詰めで表示 */}
    <p className="text-black smallfont2 opacity-60" style={{ textAlign: 'left', width: '100%' }}>選ばれたのは・・・</p>

          {/* 選択されたキャラクターの画像 */}
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected Character"
              style={{
                width: '60px',
                height: 'auto',
                display: 'block',
                margin: '5px auto',
                zIndex: 3, // 選択されたキャラクターの画像が前面に来るように
              }}
            />
          )}
      
          {/* 背景画像 */}
          <img
            src={`${process.env.PUBLIC_URL}/hosi.png`}
            alt="星の画像"
            style={{
              width: '400px',
              height: 'auto',
              display: 'block',
              position: 'absolute',
              top: '0px', // スペースを削除して修正
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1, // 最下層に設定
            }}
          />
      
          <div style={{
            position: 'relative', // テキストが画像より前面に来るように
            color: 'black',
            fontSize: '13px',
            textAlign: 'center',
            magin:'10px',
            zIndex: 2,
          }}>
            {confirmationContent}
          </div>
      
          <button 
            className="NewChat-button3 mt-4 m-2 EndChat-button smallfont0" 
            onClick={handleNavigateToChat} 
            style={{ zIndex: 2 }}>会話を始める</button>
        </div>
      );
      
      
  
  const GoHome = () => {
    navigate('/');
  };
  const Gocalender = () => {
           navigate('/calendar');
      };

  
  


  return (
    <div>
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
        <div className="flex justify-between items-center"> {/* Flexboxコンテナ */}
  {/* 左側のボタン */}
  <div className="flex">
    <button className="m-2 opacity-60" onClick={GoHome}>
      <img src={homeIcon} alt="homeIcon" />
    </button>
    <button className="m-2 opacity-60" onClick={Gocalender}>
      <img src={calenderIcon} alt="calenderIcon" />
    </button>
    </div></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px' }}>
      {/* roleSelectionContentを通常のコンテンツとしてレンダリング */}
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width: '95%', marginBottom: '10px' }}>
       
     
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {/* 各キャラクターのボタンを追加、マージンとパディングで間隔を設定 */}
            <button style={{ textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.5)',fontSize: '15px', marginBottom: '10px', paddingBottom: '5px' }} onClick={() => handleSelectRole('A')}>
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    {/* アイコン */}
    <img src={`${process.env.PUBLIC_URL}/Eicon.png`} alt="Eアイコン" style={{ width: '30px', height: '30px', marginRight: '5px' }} />
    <div>
      <div>エンジニアの25歳男性</div>
      <div style={{ fontSize: '10px', color: 'gray' }}>
        今日は何か進展ありましたか？つまずいたことあれば教えてください。一つひとつ分解して一緒に解決しましょう。
      </div>
    </div>
  </div>
</button>



<button style={{ textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.5)',fontSize: '15px', marginBottom: '10px', paddingBottom: '5px' }} onClick={() => handleSelectRole('B')}>
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    {/* アイコン */}
    <img src={`${process.env.PUBLIC_URL}/Gicon.png`} alt="Gアイコン" style={{ width: '30px', height: '30px', marginRight: '5px' }} />
    <div>
      <div>ギャル22歳女性</div>
      <div style={{ fontSize: '10px', color: 'gray' }}>
       kkk
         </div>
    </div>
  </div>
</button> 

<button style={{ textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.5)',fontSize: '15px', marginBottom: '10px', paddingBottom: '5px' }} onClick={() => handleSelectRole('C')}>
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    {/* アイコン */}
    <img src={`${process.env.PUBLIC_URL}/Ficon.png`} alt="Gアイコン" style={{ width: '30px', height: '30px', marginRight: '5px' }} />
    <div>
      <div>娘を愛でる父</div>
      <div style={{ fontSize: '10px', color: 'gray' }}>
      今日も頑張ったじゃないか！偉いぞ！生きてくれているだけで尊いからな。無理はするなよ。
         </div>
    </div>
  </div>
</button> 

   <button style={{ textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.5)', marginBottom: '10px', paddingBottom: '5px' }} onClick={handleRandomSelect}>キャラクターランダム選択</button>
          </div>
        </div>


    {/* モーダルの下に配置されるカレンダーコンテナ */}
    <div style={{ marginTop: '10px', width: '95%' }}>
  <div className="text-white" style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
    {/* 前日へ移動するボタン */}
    <button onClick={handlePrevDay}>＜</button>

    {/* 選択された日付を表示 */}
    <div style={{ margin: '0 10px' }}>
      {dayjs(daySelected).format('YYYY-MM-DD')}.
    </div>

    {/* 次の日へ移動するボタン */}
    <button onClick={handleNextDay}>＞</button>

    {/* 今日ボタン */}
    <div className="NewChat-button smallfont0 mr-5" style={{ marginLeft: 'auto' }}>
      <button onClick={handleToday}>今日</button>
    </div>
  </div>
</div>
<div className="home">
        <div>
       
        </div> 
        </div> 
        <div style={{ width: '95%' }}>
        <div className="timeline">
          {todayEvents.map((event, index) => (
            <div
              key={index}
              className="event"
              style={getEventStyle(event)}
            >
              <div className="event-title">{event.title}</div>
              <div className="event-time">
                {dayjs(event.start).format("HH:mm")} - {dayjs(event.end).format("HH:mm")}
              </div>
            </div>
          ))}
        
        <div className="Ptoumei"> 
        <Schedule events={todayEvents} />
      </div></div>
    </div> 
  </div>
      {/* 確認モーダル */}
      <Modal
        isOpen={confirmationContent !== ''}
        onClose={() => setConfirmationContent('')}
        content={confirmationModalContent}
      />
        

        </div>
    
  );
};

export default ChoosePage;
