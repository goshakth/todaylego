import React, { useState } from 'react';
import { firebase } from '../firebase';
import { useNavigate } from 'react-router-dom';

const UserInfoForm = ({ uid, onComplete }) => {
  const [userName, setUserName] = useState('');
  const [userTeam, setUserTeam] = useState('');
  const [isRole, setIsRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await firebase.firestore().collection("Users").doc(uid).update({
        UserName: userName,
        UserTeam: userTeam,
        isRole: isRole,
      });
      
      onComplete();
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  return (
    <div className="user-info-form">
      <h2>사용자 정보를 입력해주세요</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>팀:</label>
          <input
            type="text"
            value={userTeam}
            onChange={(e) => setUserTeam(e.target.value)}
            required
          />
        </div>
        <div>
          <label>역할:</label>
          <select
            value={isRole}
            onChange={(e) => setIsRole(e.target.value)}
            required
          >
            <option value="">선택해주세요</option>
            <option value="student">학생</option>
            <option value="teacher">교사</option>
          </select>
        </div>
        <button type="submit">제출</button>
      </form>
    </div>
  );
};

export default UserInfoForm; 