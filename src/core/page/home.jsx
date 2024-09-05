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

const Home = () => {
  const navigate = useNavigate();
  const { userInfo } = useUser();
  const [showChitietCong, setShowChitietCong] = useState(false);

  useEffect(() => {
    if (userInfo == null) {
      navigate("/");
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
          <div className="h3 top10">
            <div className="name">Bảng công</div>
            <div className="right" onClick={handleShowchitietCong}>
              Xem chi tiết
              <FontAwesomeIcon icon={icon.faAnglesRight} />
            </div>
          </div>
          <div className="h-items pd0x10">
            <Bangcong />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Home;
