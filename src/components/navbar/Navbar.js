import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import "./navbar.css";

function Navbar() {
  const { currentUser, isAdmin } = useContext(AuthContext);
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
          {isAdmin ? (
            // 어드민 사용자용 메뉴
            <>
              <li>
                <Link to="/totaladmin" className="admin-nav-item" onClick={() => setSidebarVisible(false)}>
                  🏠 관리자 HOME
                </Link>
              </li>
              <li>
                <Link to="/admindash" className="admin-nav-item" onClick={() => setSidebarVisible(false)}>
                  🔑 관리자 Dashboard
                </Link>
              </li>
            </>
          ) : (
            // 일반 사용자용 메뉴
            <>
              <li>
                <Link to="/dashboard" className="nav-item" onClick={() => setSidebarVisible(false)}>
                  📊 Dashboard
                </Link>
              </li>
              <li>
                <Link to="/myproject" className="nav-item" onClick={() => setSidebarVisible(false)}>
                  📁 My 프로젝트
                </Link>
              </li>
            </>
          )}
          
          <li>
            <Link to="/setup" className="nav-item setup-link" onClick={() => setSidebarVisible(false)}>
              ⚙️ 계정 정보 설정
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
