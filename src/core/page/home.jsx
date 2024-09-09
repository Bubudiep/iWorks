import React, { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import UserCard from "./home/user";
import Bangcong from "./home/bangcong";
import Iwork_logo from "../../img/logo_txt.png";
import Background from "../../img/iw_bg_2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import ChitietCong from "./home/chitietCong";
import ChamcongHomnay from "./home/chamcongHomnay";
import TienIch from "./home/tienich";
import TodayWork from "./home/todayWork/todayWork";
import TodayWorked from "./home/todayWork/todayWorked";
import TodayWorkOff from "./home/todayWork/todayWorkOff";
import Truycapnhanh from "./home/truycapnhanh";

function toDate() {
  function pad(number, length) {
    return number.toString().padStart(length, "0");
  }
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  console.log(`${year}-${month}-${date}`);
  return `${year}-${pad(month, 2)}-${pad(date, 2)}`;
}

const Home = () => {
  const navigate = useNavigate();
  const { userInfo } = useUser();
  const [showChitietCong, setShowChitietCong] = useState(false);
  const [todayWork, settodayWork] = useState(false); // Quản lý các bước thiết lập
  console.log("Home reloading...", todayWork);
  useEffect(() => {
    if (userInfo == null) {
      navigate("/");
    } else {
      userInfo?.reCord.forEach((record) => {
        if (record.workDate && record.workDate == toDate(new Date())) {
          if (record.isWorking == false) {
            settodayWork("done");
          } else {
            settodayWork(true);
          }
        }
      });
    }
  }, [userInfo, navigate]);
  const handleShowchitietCong = () => {
    setShowChitietCong(!showChitietCong);
  };
  return (
    <Suspense>
      <div className="body-container">
        <div
          className="top-container"
          style={{
            backgroundImage: `url(${Background})`,
          }}
        >
          <div className="user-container">
            <UserCard userInfo={userInfo} />
            <div className="logo">
              <img src={Iwork_logo} />
            </div>
          </div>
        </div>
        <div className="body-main">
          {showChitietCong && (
            <div className="bg-page">
              <div className="detectOut" onClick={handleShowchitietCong} />
              <ChitietCong />
            </div>
          )}
          <div className="h-items pd0x10 snap">
            {todayWork ? (
              todayWork == "done" ? (
                <TodayWorkOff />
              ) : (
                <TodayWorked />
              )
            ) : (
              <TodayWork />
            )}
          </div>
          <div className="h-items pd0x10">
            <Truycapnhanh />
          </div>
          <div className="h3 snap">
            <div className="name">Bảng công</div>
            <div className="right" onClick={handleShowchitietCong}>
              Xem chi tiết
              <FontAwesomeIcon icon={icon.faAnglesRight} />
            </div>
          </div>
          <div className="h-items pd0x10">
            <Bangcong />
          </div>
          <div className="h3 snap">
            <div className="name">Tiện ích</div>
          </div>
          <div className="h-items pd0x10">
            <TienIch />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Home;
