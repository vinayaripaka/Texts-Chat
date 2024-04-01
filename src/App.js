import React, { useEffect, useState } from 'react';
import { Routes, Route,useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatsPage from './pages/ChatsPage';
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('');
  const location=useLocation();
  useEffect(()=>{
    setCurrentPage(location.pathname);
  },[location.pathname]);

  return (
    <div className={currentPage === '/chats' ? 'App1' : 'App'}>
      <Routes>
        <Route
          path='/'
          element={<HomePage />}
        />
        <Route
          path='/chats'
          element={<ChatsPage />}
        />
      </Routes>
    </div>
  );
}

export default App;
