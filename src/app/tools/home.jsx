import React, { Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MoneyCard from "../components/money-cart";
import BangCong from "../components/bangcong";
import UserCard from "../components/user-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../context/userContext";
import Background from "../img/iw_bg_2.png";
import Iwork_logo from "../img/logo_txt.png";
import { getUserInfo, getSetting, authorize } from "zmp-sdk/apis";

var sectionStyle = {
  backgroundImage: `url(${Background})`,
};
const HomePage = () => {
  const location = useLocation();
  const { userInfo, setUserInfo } = useUser();
  if (userInfo) {
    console.log(userInfo);
  }
  let startY = 0;
  let isScrolling = false;

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimeout);

      const homeBody = document.querySelector(".home-body");
      const topContainer = homeBody?.querySelector(".top-container");
      const MoneyCard = homeBody?.querySelectorAll(".MoneyCard");

      if (homeBody && topContainer) {
        const newHeight = Math.max(105, 180 - homeBody.scrollTop);
        topContainer.style.height = `${newHeight}px`;

        if (homeBody.scrollTop > 136) {
          const newmarginTop = Math.max(35, 50 - (homeBody.scrollTop - 136));
        } else if (homeBody.scrollTop < 50) {
          const newmarginTop = Math.max(35, 50 - homeBody.scrollTop);
          topContainer.style.paddingTop = `${newmarginTop}px`;
        }

        MoneyCard.forEach((card) => {
          const newcardHeight = Math.max(0, 92 - homeBody.scrollTop);
          card.style.height = `${newcardHeight}px`;
          card.style.opacity = newcardHeight / 92;
        });
      }

      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 200); // Thời gian dừng scroll để coi là đã dừng lại
    };

    const handleTouchStart = (e) => {
      const homeBody = document.querySelector(".home-body");
      startY = homeBody.scrollTop;
    };

    const handleTouchEnd = (e) => {
      const homeBody = document.querySelector(".home-body");
      const endY = homeBody.scrollTop;
      const direction = endY > startY ? "down" : "up";

      const checkIsScrolling = () => {
        if (!isScrolling) {
          if (direction === "down") {
            if (homeBody.scrollTop < 135) {
              homeBody.scrollTo({ top: 135, behavior: "smooth" });
            }
          } else {
            if (homeBody.scrollTop < 135) {
              homeBody.scrollTo({ top: 0, behavior: "smooth" });
            }
          }
        } else {
          console.log("Scrolling...", isScrolling);
          requestAnimationFrame(checkIsScrolling); // Chờ đến khi isScrolling là false
        }
      };
      requestAnimationFrame(checkIsScrolling);
    };

    const homeBody = document.querySelector(".home-body");
    if (homeBody) {
      homeBody.addEventListener("scroll", handleScroll);
      homeBody.addEventListener("touchstart", handleTouchStart);
      homeBody.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (homeBody) {
        homeBody.removeEventListener("scroll", handleScroll);
        homeBody.removeEventListener("touchstart", handleTouchStart);
        homeBody.removeEventListener("touchend", handleTouchEnd);
      }
      clearTimeout(scrollTimeout);
    };
  }, [isScrolling]);

  return (
    <Suspense>
      <div className="body-container">
        <div className="top-container" style={sectionStyle}>
          <div className="user-container">
            <UserCard userInfo={userInfo} />
            <div className="logo">
              <img src={Iwork_logo} />
            </div>
          </div>
          <div className="fast-option">
            <MoneyCard userInfo={userInfo} />
          </div>
        </div>
        <div className="body-main">
          <div className="pd0x10">
            <div className="message-container">
              <div className="message">Hôm nay bạn có đi làm không?</div>
              <div className="options">
                <div className="items active">
                  <div className="logo">
                    <FontAwesomeIcon icon={icon.faCalendarCheck} />
                  </div>
                  <div className="text">Chấm công ngay!</div>
                </div>
                <div className="items">
                  <div className="logo">
                    <FontAwesomeIcon icon={icon.faCalendar} />
                  </div>
                  <div className="text">Hôm nay nghỉ!</div>
                </div>
              </div>
            </div>
          </div>
          <div className="h3 top10">Bảng công</div>
          <div className="h-items pd0x10">
            <BangCong userInfo={userInfo} />
          </div>
          <div className="h3 top10">Tiện ích</div>
          <div className="h-items pd0x10">
            <div className="extension-list">
              {Array.from({ length: 12 }).map((_, index) => (
                <div className="items" key={index}>
                  <div className="logo"></div>
                  <div className="name">Bảng lương</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default HomePage;
