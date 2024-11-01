import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import "./navbar.css";

function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  // 사이드바 표시 상태를 토글하는 함수
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // 로그인된 경우에만 네브바를 표시
  if (!currentUser) {
    return null;
  }

  return (
    <div>
      {/* 햄버거 메뉴 아이콘 */}
      <div className="hamburger-menu" onClick={toggleSidebar}>
        ☰
      </div>

      {/* 사이드바 */}
      <div className={`sidebar ${isSidebarVisible ? "is-visible" : ""}`}>
        <ul className="nav-links">
          <li>
            <Link to="/dashboard" className="nav-item">
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link to="/myproject" className="nav-item">
              📁 My 프로젝트
            </Link>
          </li>
          <li>
            <Link to="/settings" className="nav-item">
              ⚙️ Settings
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
