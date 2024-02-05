import React, { useState,useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import { chat, requestSummary } from './chat'; // 既存のimport文にrequestSummaryを追加
import LoadingOverlay from './LoadingOverlay'; // Loader.js からデフォルトエクスポートされたコンポーネントをインポート
import './styles/styles.css'; 
import calenderIcon from './icon/calenderIcon.svg';
import NewChatIcon from './icon/NewChatIcon.svg';
import Modal from './modal'; // あなたのファイルパスに合わせて変更してください

const NewChatPage = () => {
  const [setConversationId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalContent, setModalContent] = useState('');

const handleRefresh = () => {
  window.location.reload();
};
const scrollToBottom = () => {
  const conversationHistory = document.querySelector(".conversation-history");
  if (conversationHistory) {
    conversationHistory.scrollTop = conversationHistory.scrollHeight;
  }
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


const Gocalender = () => {
         navigate('/calender');
    };

 const handleSubmit = async (event) => {
  event.preventDefault();
  const userMessage = { type: 'user', text: message };

  // ユーザーのメッセージを即時に追加
  setConversations(conversations => [...conversations, userMessage]);
  setMessage(''); // メッセージ入力をクリア

  setIsLoading(true); // ローディング開始
  try {
    const responseText = await chat(message); // AIの返答を非同期で取得
    // ボットの返答を追加
    setConversations(conversations => [...conversations, { type: 'bot', text: responseText }]);
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
  <button className=" NewChat-button ml-2 EndChat-button" onClick={handleEndChat}>
    End Chat
  </button>
  {/* 右側のボタン */}
<button className="m-2 opacity-60" onClick={Gocalender}>
  <img src={calenderIcon} alt="calenderIcon" />
</button>
<button className="m-2 opacity-60" onClick={handleRefresh}>
  <img src={NewChatIcon} alt="NewChatIcon" />
</button>
</div>
    </div>
      <form onSubmit={handleSubmit}>
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
    <div className="conversation-history">
      {conversations.map((conversation, index) => (
        <div key={index} className={`message-box ${conversation.type === 'user' ? 'user-message' : 'bot-message'}`}>
          <p><b>{conversation.type === 'user' ? 'Y: ' : 'A: '}</b>{conversation.text}</p>
        </div>
        ))}
      </div>
          </div>
        <div>
    {isLoading ? (
      <LoadingOverlay />
    ) : (
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        content={modalContent} 
      />
    )}
  </div>      
    </div>
    </div>
  );
};

export default NewChatPage;