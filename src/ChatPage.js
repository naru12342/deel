//ChatPage.js
import React, { useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate , useLocation} from 'react-router-dom';
import { chat, requestSummary } from './chat'; // 既存のimport文にrequestSummaryを追加
import LoadingOverlay from './LoadingOverlay'; // Loader.js からデフォルトエクスポートされたコンポーネントをインポート
import './styles/styles.css'; 
import calenderIcon from './icon/calenderIcon.svg';
import NewChatIcon from './icon/NewChatIcon.svg';
import homeIcon from './icon/homeIcon.svg';
import Modal from './modal'; // あなたのファイルパスに合わせて変更してください


const ChatPage = () => {
  const [conversationId, setConversationId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalContent, setModalContent] = useState('');
const [selectedRole, setSelectedRole] = useState('');

const [selectedRoleText, setSelectedRoleText] = useState('美術科の女子');
// 状態で日付と時刻を管理
const [startTime, setStartTime] = useState('');

  let location = useLocation();
  useEffect(() => {
    if (location.state?.role) {
      setSelectedRole(location.state.role);  
      setSelectedRoleText(convertRoleToText(location.state.role));
  // ChoosePageから渡されたroleを設定
    }
  }, [location]);





const [botIcon, setBotIcon] = useState(`${process.env.PUBLIC_URL}/Eicon.png`); // デフォルトアイコンを設定


  // 役割が変更されたときにアイコンを更新
  useEffect(() => {
    switch (selectedRole) {
      case 'A':
        setBotIcon(`${process.env.PUBLIC_URL}/Eicon.png`);
        break;
      case 'B':
        setBotIcon(`${process.env.PUBLIC_URL}/Gicon.png`);
        break;
      case 'C':
        setBotIcon(`${process.env.PUBLIC_URL}/Ficon.png`);
        break;
      default:
        setBotIcon(`${process.env.PUBLIC_URL}/Ricon.png`); // デフォルトアイコン
    }
  }, [selectedRole]);



// 選択されたキャラクターに応じて表示するテキストを設定する関数
const convertRoleToText = (role) => {
  switch (role) {
    case 'A':
      return 'エンジニアの25歳男性';
    case 'B':
      return 'ギャル22歳女性';
    case 'C':
      return '娘を愛でる父';
    default:
      return '';
  }
};

const scrollToBottom = () => {
  const conversationHistory = document.querySelector(".conversation-history");
  if (conversationHistory) {
    conversationHistory.scrollTop = conversationHistory.scrollHeight;
  }
};

// テキストエリアの高さをリセットする関数
function resetTextareaHeight() {
  const textarea = document.querySelector(".input-container textarea");
  if (textarea) {
    textarea.style.height = 'auto'; // 高さを一旦リセット
    textarea.style.height = '20px'; // 初期の高さに設定
  }
}
const handleRefresh = () => {
  navigate( '/choose');
};
 
useEffect(() => {
  scrollToBottom();
}, [conversations]);

  function autoResize(e) {
    e.target.style.height = 'auto';  // テキストエリアの高さをリセット
    e.target.style.height = e.target.scrollHeight + 'px';  // スクロール高さに基づいて高さを設定
  }
  const handleEndChat = async () => {
    const conversationText = conversations.map(conv => `${conv.type === 'user' ? 'User' : 'Bot'}: ${conv.text}`).join('\n');
  
    setIsLoading(true);
    try {
      const summary = await requestSummary(conversationText);
      setModalContent(summary); // 要約をモーダルコンテンツに設定
      setIsModalOpen(true); // モーダルを表示
      
      // ここでサーバーに要約を送信する
      if (conversationId) {
        await axios.post('https://agile-anchorage-23875-a593ab30dd30.herokuapp.com/api/conversations/summary', {
          conversationId,
          summary // 要約テキストを送信
        });
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // メッセージの格納
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  let navigate = useNavigate();


const GoHome = () => {
  navigate('/');
};
const Gocalender = () => {
         navigate('/calendar');
    };

 const handleSubmit = async (event) => {
  event.preventDefault();
  const newConversations = [...conversations, { type: 'user', text: message }];
  setConversations(newConversations);
  // メッセージ送信後にテキストエリアの高さをリセット
  setMessage('');  // これは既にあるコードです
  resetTextareaHeight();

  setIsLoading(true); // ローディング開始
  try {
    const responseText = await chat(message, selectedRole);  // AIの返答を非同期で取得
  newConversations.push({ type: 'bot', text: responseText });
  setConversations(newConversations); // AIの返答を会話履歴に追加
  // 会話をサーバーに送信し、新しい会話IDを取得
  // APIリクエストにstartTimeを含める
  const response = await axios.post('https://agile-anchorage-23875-a593ab30dd30.herokuapp.com/api/conversations', {
    messages: newConversations,
    conversationId,
    startTime // ここに日付と時刻を追加
  }); // 新しい会話が始まった場合、そのIDを状態にセット
 if (!conversationId) {
  setConversationId(response.data.conversationId);
}
 } catch (error) {
    console.error('Error communicating with bot:', error);
  } finally {
    setIsLoading(false); // ローディング終了
  }
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
      </div>
        <div className="content">
        </div>
        <div>
      {/* 既存のチャットページのコンテンツ */}
      <div className="flex justify-between items-center"> {/* Flexboxコンテナ */}
  {/* 左側のボタン */}
  <div className="flex">
    <button className="m-1 ml-2 opacity-60" onClick={GoHome}>
      <img src={homeIcon} alt="homeIcon" />
    </button>
    <button className="m-1 opacity-60" onClick={Gocalender}>
      <img src={calenderIcon} alt="calenderIcon" />
    </button>
    <button className="m-1 opacity-60" onClick={handleRefresh}>
      <img src={NewChatIcon} alt="NewChatIcon" />
    </button>
    

  {/* 右側のボタンをグループ化 */}
  <button className="NewChat-button ml-1 mt-3 EndChat-button smallfont0" onClick={handleEndChat}>
    Summarize
  </button>
<div>
<div className='ml-3 text-white opacity-80 smallfont0'>
  <label>日付設定:</label>
  </div>

  <input
    type="datetime-local"
    value={startTime}
    onChange={(e) => setStartTime(e.target.value)}
    style={{
      backgroundColor: 'transparent', // 背景色を透明に設定
      border: 'none', // ボーダーを削除
      outline: 'none', // フォーカス時のアウトラインを削除
      color: 'white', // 文字色を白に設定（必要に応じて調整）
    }}
    className='ml-1 NewChat-button smallfont0'
  />
</div>

 

  </div>
</div>
</div>

      <form onSubmit={handleSubmit}>
       {/* 選択されたロールとアイコンの表示 */}
       <div className="selected-role-display smallfont text-white">
<div className="selected-role-container" style={{ display: 'flex', alignItems: 'center' }}>
  {/* アイコンを表示する */}
  <div className="role-icon" style={{
    backgroundImage: `url(${botIcon})`,
    width: '30px', // アイコンのサイズは適宜調整してください
    height: '30px',
    backgroundSize: 'cover',
    margin: '8px',
     // アイコンとテキストの間隔
  }}></div>
  {/* 選択されたロールのテキスト */}
  {selectedRoleText && <p style={{ margin: 0 }}>{selectedRoleText}</p>}
</div></div>

      <div className="chat-container">
      <div className="input-container">
        <label>
          <textarea
            rows='1'
            cols='50'
            value={message}
            onChange={handleMessageChange}
            onInput={autoResize}
             />
        </label>
        <div>
          <button type="submit">▶︎</button>
        </div>
        </div>
        </div>
      </form>
      <div>
        {/* <button onClick={handleSaveConversations}>会話を保存する</button> */}
      </div>
      <div>
      <div>  
      {isLoading && <LoadingOverlay />}
      <div className="conversation-history smallfont2">
   
   <div className={` ${message.type === 'user' ? '' : 'bot-message-container'}`}>
   {conversations.map((conversation, index) => (
       <div key={index} className={`message-box ${conversation.type === 'user' ? 'user-message' : 'bot-message'}`}>
        
         {conversation.type === 'bot' && <div className="icon-bot"style={{ backgroundImage: `url(${botIcon})` }}></div>}
      
         <p><b>{conversation.type === 'user' ? '' : ''}</b>{conversation.text}</p>
         {conversation.type === 'user' && <div className="icon-bot2"></div>}
       </div>
       
       ))}
      </div>
          </div>
          </div>
        <div>
        {isLoading ? (
  <div>
    <LoadingOverlay />
    <p style={{ textAlign: 'center', marginTop: '37%',color: 'white' }}>要約中</p>
  </div>
) : (
  <div className="conversation-history smallfont2">
    <Modal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)}
      content={modalContent} 
    />
  </div>
)}

    
  </div>      
    </div>
    </div>
  );
};

export default ChatPage;