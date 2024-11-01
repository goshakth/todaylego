// App.js

import React from 'react';
import { createGlobalStyle } from 'styled-components'; /// 새로추가


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import { AuthProvider } from './AuthProvider';
import { AuthProvider } from './AuthProvider';
import PrivateRoute from './PrivateRoute';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import Header from './components/Header/header';
import Navbar from './components/Navbar/Navbar';
import MyProject from './components/mypage/myproject';
import MyDashboard from './components/mypage/mydashboard';

const GlobalStyle = createGlobalStyle`
  body {
    background: #e9ecef;
  }
`;


function App() {
  return (
    <AuthProvider>

      <Router>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute><MyDashboard /></PrivateRoute>} />
          <Route path="/myproject" element={<PrivateRoute><MyProject /></PrivateRoute>} />


         
          {/* <PrivateRoute path="/clubdetail" element={<ClubDetail />} /> 보호된 경로 */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
