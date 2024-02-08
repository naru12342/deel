import React, { useState,useEffect} from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import { chat, requestSummary } from './chat'; // 既存のimport文にrequestSummaryを追加
import LoadingOverlay from './LoadingOverlay'; // Loader.js からデフォルトエクスポートされたコンポーネントをインポート
import './styles/styles.css'; 
import calenderIcon from './icon/calenderIcon.svg';
import NewChatIcon from './icon/NewChatIcon.svg';
import homeIcon from './icon/homeIcon.svg';
import Modal from './modal'; // あなたのファイルパスに合わせて変更してください

const NewChat = () => {

  const [conversationId, setConversationId] = useState(null);
  const location = useLocation();
  const [conversation, setConversation] = useState(location.state.selectedConversation);
  const [messages, setMessages] = useState([]); // setMessagesの修正
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalContent, setModalContent] = useState('');

 useEffect(() => {
    if (conversation && conversation.messages) {
        // 選択された会話のメッセージをconversations状態に追加
        const initialMessages = conversation.messages.map(msg => ({
          type: msg.type,
          text: msg.text
        }));
        setConversations(initialMessages);
      }
  }, [conversation]);

const scrollToBottom = () => {
  const conversationHistory = document.querySelector(".conversation-history");
  if (conversationHistory) {
    conversationHistory.scrollTop = conversationHistory.scrollHeight;
  }
};
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
  
      // サマリーをデータベースに保存するためのリクエストを送信
      await axios.post('https://agile-anchorage-23875-a593ab30dd30.herokuapp.com/api/conversations/saveSummary', {
        conversationId,
        summary,
      });
  
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
        setMessage('');
      
        setIsLoading(true); // ローディング開始
        try {
          const responseText = await chat(message); // AIの返答を非同期で取得
        newConversations.push({ type: 'bot', text: responseText });
        setConversations(newConversations); // AIの返答を会話履歴に追加
        // 会話をサーバーに送信し、新しい会話IDを取得
        const response = await axios.post('https://agile-anchorage-23875-a593ab30dd30.herokuapp.com/api/conversations', { messages: newConversations, conversationId });
       // 新しい会話が始まった場合、そのIDを状態にセット
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
    <button className="m-2 opacity-60" onClick={GoHome}>
      <img src={homeIcon} alt="homeIcon" />
    </button>
    <button className="m-2 opacity-60" onClick={Gocalender}>
      <img src={calenderIcon} alt="calenderIcon" />
    </button>
    <button className="m-2 opacity-60" onClick={handleRefresh}>
      <img src={NewChatIcon} alt="NewChatIcon" />
    </button>
  </div>

  {/* 右側のボタンをグループ化 */}
  <button className="NewChat-button m-1 EndChat-button text-sm" onClick={handleEndChat}>
  Summarize
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
      </div>
      
      


      <div>  
      {isLoading && <LoadingOverlay />}
    <div className="conversation-history smallfont2">
   
    <div className={` ${message.type === 'user' ? '' : 'bot-message-container'}`}>
    {conversations.map((conversation, index) => (
        <div key={index} className={`message-box ${conversation.type === 'user' ? 'user-message' : 'bot-message'}`}>
         
          {conversation.type === 'bot' && <div className="icon-bot"></div>}
          <p><b>{conversation.type === 'user' ? '' : ''}</b>{conversation.text}</p>
          {conversation.type === 'user' && <div className="icon-bot2"></div>}
        </div>
        
        ))}
        </div>
      </div>
          </div>
        <div>
    {isLoading ? (
      <LoadingOverlay />
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
    
  );
};

export default NewChat;