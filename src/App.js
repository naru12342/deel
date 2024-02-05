import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import ChatPage from './ChatPage';
import NewChat from './NewChat';
import CalendarApp from './CalendarApp';
import WeekPage from "./WeekPage";
import ChoosePage from './ChoosePage';
import NotificationSubscription from './NotificationSubscription';
import ContextWrapper from './context/ContextWrapper'; // 正確なパスに注意してください


function App() {
  useEffect(() => {
    // Service Workerを登録
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/serviceWorker.js')
        .then(function(registration) {
          console.log('Service Worker registration successful with scope: ', registration.scope);
        })
        .catch(function(error) {
          console.log('Service Worker registration failed: ', error);
        });
    }
  }, []);

  

  return (
    <div className="App">
      <ContextWrapper> {/* ContextProviderで全体をラップ */}
        <NotificationSubscription />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/newchat" element={<NewChat />} />
            <Route path="/calendar" element={<CalendarApp />} />
            <Route path="/week/:startDate" element={<WeekPage />} />
            <Route path="/choose" element={<ChoosePage />} />
          </Routes>
        </Router>
      </ContextWrapper>
    </div>
  );
}

export default App;
