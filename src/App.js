// App.js

import React from 'react';
import { createGlobalStyle } from 'styled-components'; /// 새로추가


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import { AuthProvider } from './AuthProvider';
import { AuthProvider } from './AuthProvider';
import PrivateRoute from './PrivateRoute';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import Header from './components/Header/header';
import Navbar from './components/Navbar/Navbar';
import MyProject from './components/mypage/myproject';
import MyDashboard from './components/mypage/mydashboard';
import AddDepartment from './addDepartments';
import Admindash from './components/Admin/admindash';
import AddLegoData from './addLegodata';
import Totaladmin from './components/Admin/totaladmin';
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
        <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute><MyDashboard /></PrivateRoute>} />
          <Route path="/myproject" element={<PrivateRoute><MyProject /></PrivateRoute>} />
          <Route path="/add-department" element={<PrivateRoute><AddDepartment /></PrivateRoute>} /> {/* 새 경로 추가 */}
          <Route path="/add-task" element={<PrivateRoute><AddLegoData /></PrivateRoute>} /> {/* 새 경로 추가 */}
          <Route path="/admindash" element={<PrivateRoute><Admindash/></PrivateRoute>} /> {/* 관리자 페이지 라우트 추가 */}
          <Route path="/totaladmin" element={<PrivateRoute><Totaladmin /></PrivateRoute>} /> {/* 새로운 라우트 추가 */}


         
          {/* <PrivateRoute path="/clubdetail" element={<ClubDetail />} /> 보호된 경로 */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
