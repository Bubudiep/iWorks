import React, { Suspense, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MoneyCard from "../components/money-cart";
import BangCong from "../components/bangcong";
import UserCard from "../components/user-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../context/userContext";
import Background from "../img/iw_bg_2.png";
import Iwork_logo from "../img/logo_txt.png";
import Create_workSheet from "../components/create_worksheet";
import { getUserInfo, getSetting, authorize } from "zmp-sdk/apis";
import TodayWork from "../components/todayWork";
import UpdateTodayWork from "../components/todayWork_update";

function pad(number, length) {
  return number.toString().padStart(length, "0");
}
var sectionStyle = {
  backgroundImage: `url(${Background})`,
};
function toDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  console.log(`${year}-${month}-${date}`);
  return `${year}-${pad(month, 2)}-${pad(date, 2)}`;
}
const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [todayWork, settodayWork] = useState(false); // Quản lý các bước thiết lập
  const { userInfo, setUserInfo } = useUser();

  useEffect(() => {
    if (userInfo) {
      if (userInfo.workSheet.items) {
        userInfo.workSheet.items.forEach((items) => {
          if (items.WorkRecord) {
            items.WorkRecord.forEach((record) => {
              console.log(record);
              if (record.workDate && record.workDate == toDate(new Date())) {
                settodayWork(true);
              }
            });
          }
        });
      }
    } else {
      navigate("/");
    }
  }, [navigate]);
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
            {userInfo?.workSheet?.items.length > 0 ? (
              <MoneyCard />
            ) : (
              <Create_workSheet />
            )}
          </div>
        </div>
        <div className="body-main">
          {todayWork ? <UpdateTodayWork /> : <TodayWork />}
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
