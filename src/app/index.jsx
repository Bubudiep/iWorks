import React, { Suspense } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { List, Page, Icon, useNavigate } from "zmp-ui";
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
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="home-container">
      <div className="home-body">
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
