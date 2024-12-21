import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import Logout from "../logout/Logout";
import firebase from "firebase/app";
import "./header.css";

function Header() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate("/login");
      });
  };

  // 로그인 한 사용자에게만 Navbar를 보여줍니다.
  if (currentUser) {
    return (
      <nav className="fixed-top pt-0">
        <div className="navAlign">
          <a href="/dashboard" role="button">
            <img className="logo" src="/sha_logo.png" alt="sha logo" />
          </a>

          <div className="user-controls">
            <div className="nav-link-box" onClick={signOut}>
               Sign Out
            </div>
          </div>
          <div className="nav-search">
              <input type="text" placeholder="🔍 검색" />
          </div>
        </div>
      </nav>
    );
  } else {
    // 로그인하지 않은 사용자에게는 아무것도 보여주지 않습니다.
    return null;
  }
}

export default Header;
