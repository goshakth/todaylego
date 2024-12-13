// LoginPage.js
import React, { useState, useContext } from "react";
import { firebase, auth } from "./firebase";
import './styles/GoogleSignInButton.css';
import './styles/Login.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, setIsAdmin } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState('');

  const handleIsAdmin = async (email_handle, userDocSnapshot) => {
    return userDocSnapshot.data().isSuperUser || false;
  };
  

  const signInWithGoogle = async () => {
    try {
      const result = await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      console.log(result.user);

      const email = result.user.email;
      const email_handle = email.substring(0, email.lastIndexOf("@"));
      const domain = email.substring(email.lastIndexOf("@") + 1);

      const uid = result.user.uid; // Firebase Auth UID 가져오기

      if (domain !== 'gmail.com') {
        await auth.signOut();
        console.log('Only members of the SAS community may access this page. Please log in with sas.edu.sg account!');
        setErrorMsg('Only members of the SAS community may access this page. Please log in with sas.edu.sg account');
      } else {
        //const userDocRef = firebase.firestore().collection("Users").doc(email_handle);
        const userDocRef = firebase.firestore().collection("Users").doc(uid); // UID를 문서 ID로 사용

        const userDocSnapshot = await userDocRef.get();

        if (!userDocSnapshot.exists) {
          await userDocRef.set({
            email: email,
            isSuperUser: false,
            currentUserId: uid, // Firebase UID를 Users 컬렉션에 추가
            UserName:'',
            UserTeam:'',            
          });
        }else {
          // 기존 사용자 문서 업데이트 (필요한 경우)
          await userDocRef.update({
            currentUserId: uid, // UID가 이미 있더라도 항상 업데이트 가능
            UserName:'',
            UserTeam:'',
          });
        }
        
        const isAdminStatus = await handleIsAdmin(email_handle, userDocSnapshot);
        setIsAdmin(isAdminStatus);

        //let { from } = location.state || { from: { pathname: isAdmin ? "/admindash" : "/dashboard" } }; // 로그인한 사용자가 어드민인지(isAdmin 값이 true인지) 확인
        //navigate(from);
        // isAdmin 상태에 따른 페이지 리디렉션
        if (isAdminStatus) {
          navigate('/admindash'); // 관리자는 관리자 페이지로 이동
        } else {
          navigate('/dashboard'); // 일반 사용자는 대시보드로 이동
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className=" login-background">
    {/* <div><img src="/img/saslogo.png" /></div> */}
    <div className="Title">
      Welcome to Sha LEGO Portal!
    </div>
    <div className="googleLoginButton">
      <button onClick={signInWithGoogle} className="google-btn" type="button">
        <span className="google-icon-wrapper">
          <img className="google-icon"
            src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" />
        </span>
        <span className="google-btn-text">Sign in with Google</span>
      </button>
    </div>
    {errorMsg && <p>{errorMsg}</p>}
  </div>
  );
};

export default LoginPage;