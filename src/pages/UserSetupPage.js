import React, { useState, useContext, useEffect } from 'react';
import { firebase } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';
import '../styles/UserSetup.css';

const UserSetupPage = () => {
  const [userName, setUserName] = useState('');
  const [userTeam, setUserTeam] = useState('');
  const [isRole, setIsRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // 현재 사용자의 정보를 불러옴
    const loadUserInfo = async () => {
      try {
        const userDoc = await firebase.firestore()
          .collection("Users")
          .doc(currentUser.uid)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserName(userData.UserName || '');
          setUserTeam(userData.UserTeam || '');
          setIsRole(userData.isRole || '');
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading user info:", error);
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await firebase.firestore().collection("Users").doc(currentUser.uid).update({
        UserName: userName,
        UserTeam: userTeam,
        isRole: isRole,
      });
      
      // 수정 완료 후 대시보드로 이동
      navigate(isAdmin ? '/admindash' : '/dashboard');
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  if (isLoading) {
    return <div className="user-setup-container">Loading...</div>;
  }

  return (
    <div className="user-setup-container">
      <div className="user-setup-form">
        <h2>계정 정보 설정</h2>
        <p>이용을 위해 필요한 정보를 입력해주세요.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이름:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder="이름을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label>팀:</label>
            <input
              type="text"
              value={userTeam}
              onChange={(e) => setUserTeam(e.target.value)}
              required
              placeholder="소속 팀을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label>부서분류:</label>
            <select
              value={isRole}
              onChange={(e) => setIsRole(e.target.value)}
              required
            >
              <option value="">선택해주세요</option>
              <option value="1">사업부서</option>
              <option value="2">경영부서</option>
              <option value="3">디자인</option>
            </select>
          </div>
          <button type="submit" className="submit-button">정보 저장</button>
        </form>
      </div>
    </div>
  );
};

export default UserSetupPage; 