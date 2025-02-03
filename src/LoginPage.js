// LoginPage.js
import React, { useState, useContext } from "react";
import { firebase, auth } from "./firebase";
import './styles/GoogleSignInButton.css';
import './styles/Login.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import UserInfoForm from './components/UserInfoForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, setIsAdmin, currentUser } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState('');
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  const [tempUid, setTempUid] = useState(null);

  // 이미 로그인된 사용자 처리
  React.useEffect(() => {
    if (currentUser) {
      // 이미 로그인된 사용자는 대시보드로 리디렉션
      if (isAdmin) {
        navigate('/admindash');
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUser, isAdmin, navigate]);

  const handleIsAdmin = async (email_handle, userDocSnapshot) => {
    return userDocSnapshot.data().isSuperUser || false;
  };
  

  const signInWithGoogle = async () => {
    try {
      const result = await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      const email = result.user.email;
      const email_handle = email.substring(0, email.lastIndexOf("@"));
      const domain = email.substring(email.lastIndexOf("@") + 1);
      const uid = result.user.uid;

      if (domain !== 'gmail.com') {
        await auth.signOut();
        setErrorMsg('Only members of the SAS community may access this page. Please log in with sas.edu.sg account');
      } else {
        const userDocRef = firebase.firestore().collection("Users").doc(uid);
        const userDocSnapshot = await userDocRef.get();

        if (!userDocSnapshot.exists) {
          // 새 사용자인 경우 기본 문서 생성
          await userDocRef.set({
            email: email,
            UserName: '',
            UserTeam: '',
            isRole: '',
            isSuperUser: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          navigate('/setup');
        } else if (!userDocSnapshot.data().UserName || !userDocSnapshot.data().UserTeam || !userDocSnapshot.data().isRole) {
          // 필수 정보가 없는 경우
          navigate('/setup');
        } else {
          const isAdminStatus = await handleIsAdmin(email_handle, userDocSnapshot);
          setIsAdmin(isAdminStatus);
          navigate(isAdminStatus ? '/admindash' : '/dashboard');
        }
      }
    } catch (error) {
      console.log(error.message);
      setErrorMsg(error.message);
    }
  };

  const handleUserInfoComplete = async () => {
    const userDocRef = firebase.firestore().collection("Users").doc(tempUid);
    const userDocSnapshot = await userDocRef.get();
    const email = currentUser.email;
    const email_handle = email.substring(0, email.lastIndexOf("@"));
    const isAdminStatus = await handleIsAdmin(email_handle, userDocSnapshot);
    setIsAdmin(isAdminStatus);
    setShowUserInfoForm(false);
    navigate(isAdminStatus ? '/admindash' : '/dashboard');
  };

  return (
    <div className="login-background">
      {!showUserInfoForm ? (
        <>
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
        </>
      ) : (
        <UserInfoForm uid={tempUid} onComplete={handleUserInfoComplete} />
      )}
    </div>
  );
};

export default LoginPage;