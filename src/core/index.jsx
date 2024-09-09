import React, { useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";

const botItems = [
  {
    icon: <FontAwesomeIcon icon={icon.faHouse} />,
    name: "Trang chủ",
    link: "/home/",
  },
  {
    icon: <FontAwesomeIcon icon={icon.faBriefcase} />,
    name: "Việc làm",
    link: "/work/",
  },
];

const HomePage = () => {
  const location = useLocation();
  const homeBodyRef = useRef(null); // Dùng useRef để lấy tham chiếu đến home-body

  // Theo dõi sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => {
      if (homeBodyRef.current) {
        console.log("Vị trí cuộn:", homeBodyRef.current.scrollTop);
        // Thêm hành động khác khi cuộn, ví dụ: kiểm tra cuộn tới cuối
        if (
          homeBodyRef.current.scrollTop + homeBodyRef.current.clientHeight >=
          homeBodyRef.current.scrollHeight
        ) {
          console.log("Cuộn tới cuối rồi!");
          // Tải thêm nội dung nếu cần
        }
      }
    };

    const bodyElement = homeBodyRef.current;
    bodyElement.addEventListener("scroll", handleScroll);

    return () => {
      bodyElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="home-container">
      <div className="home-body" ref={homeBodyRef}>
        {/* Phần nội dung của trang */}
        <Outlet />
      </div>
      <div className="home-menu">
        {botItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.link + location.search}
            className={
              "menu-item " + (location.pathname === item.link ? "active" : "")
            }
          >
            <div className="icon">{item.icon}</div>
            <div className="txt">{item.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
