import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import ApiClient from "../../../components/api";
import { useUser } from "../../context/userContext";
import dilamkhong from "../../../img/dilamkhong.png";

const ChamcongHomnay = () => {
  const [loading, setLoading] = useState(false);
  const { userInfo, setUserInfo } = useUser();
  const fetchs = ApiClient();

  // Mảng chứa các câu ngẫu nhiên
  const messages = [
    "Hôm nay bạn có đi làm không?",
    "Bạn đã sẵn sàng chấm công hôm nay chưa?",
    "Chấm công nào! Hôm nay làm việc hay nghỉ ngơi?",
    "Đi làm hay nghỉ? Hãy chọn đi nào!",
    "Bạn có đi làm hôm nay không?",
    "Làm hay nghỉ nói một lời!",
    "Chấm công đi!",
  ];

  // Chọn ngẫu nhiên một câu chào từ mảng
  const [randomMessage, setRandomMessage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setRandomMessage(messages[randomIndex]);
  }, []); // Chỉ chạy một lần khi component được mount

  console.log(userInfo);

  return (
    <div className="top10">
      <div className="message-container">
        <div className="logo">
          <img src={dilamkhong} alt="Chấm công" />
        </div>
        <div className="message">
          <div className="content">{randomMessage}</div>
        </div>
        <div className="options">
          <div className="items active">
            <div className="logo">
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <FontAwesomeIcon icon={icon.faCalendarCheck} />
              )}
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
  );
};

export default ChamcongHomnay;
