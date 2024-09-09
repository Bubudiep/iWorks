import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import ApiClient from "../../../../components/api";
import { useUser } from "../../../context/userContext";
import dilamkhong from "../../../../img/dilamkhong.png";
import happiness from "../../../../img/happiness.png";
import note from "../../../../img/note.png";
import cheer_up from "../../../../img/cheer-up.png";

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
const TodayWork = () => {
  const { userInfo, setUserInfo } = useUser();
  const [loading, setLoading] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const fetchData = ApiClient();
  console.log(userInfo);
  const handleChamCongNgay = async () => {
    setLoading(true); // Start loading
    try {
      // Call the API to update user info
      const chamcong = await fetchData.post(
        "/cham-cong-ngay",
        {
          workDate: toDate(),
        },
        userInfo.login.token
      );
      if (chamcong && chamcong?.result == "pass") {
        const response = await fetchData.gets(
          "/workrecord?per_page=999&month=" +
            (new Date().getMonth() + 1) +
            "&year=" +
            new Date().getFullYear(),
          userInfo.login.token
        );
        setUserInfo((prevUser) => ({ ...prevUser, reCord: response.items }));
      } else {
        console.error("Failed to update user info");
      }
    } catch (error) {
      console.error("Error calling the API:", error);
    } finally {
      setLoading(false); // End loading
    }
  };
  const handleNghihomnay = async () => {
    setLoading3(true);
    try {
      const chamcong = await fetchData.post(
        "/nghi-viec-ngay",
        { workDate: toDate() },
        userInfo.login.token
      );
      if (chamcong && chamcong?.result == "pass") {
        const response = await fetchData.gets(
          "/workrecord?per_page=999&month=" +
            (new Date().getMonth() + 1) +
            "&year=" +
            new Date().getFullYear(),
          userInfo.login.token
        );
        setUserInfo((prevUser) => ({ ...prevUser, reCord: response.items }));
      } else {
        console.error("Failed to update user info");
      }
    } catch (error) {
      console.error("Error calling the API:", error);
    } finally {
      setLoading3(false);
    }
  };
  // Mảng chứa các câu ngẫu nhiên
  const messages = [
    { icon: dilamkhong, message: "Hôm nay bạn có đi làm không?" },
    { icon: cheer_up, message: "Bạn đã sẵn sàng chấm công hôm nay chưa?" },
    { icon: note, message: "Chấm công nào! Hôm nay làm việc hay nghỉ ngơi?" },
    { icon: note, message: "Đi làm hay nghỉ? Hãy chọn đi nào!" },
    { icon: happiness, message: "Xin chào, bạn còn nhớ mình không?" },
    { icon: note, message: "Làm hay nghỉ nói một lời!" },
    { icon: happiness, message: "Chào mừng bạn trở lại!" },
  ];
  const [randomMessage, setRandomMessage] = useState("");
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setRandomMessage(messages[randomIndex]);
  }, []); // Chỉ chạy một lần khi component được mount
  return (
    <div className="top10">
      <div className="message-container">
        <div className="logo">
          <img src={randomMessage.icon} alt="Chấm công" />
        </div>
        <div className="message">
          <div className="content">{randomMessage.message}</div>
        </div>
        <div className="options">
          <div className="items active" onClick={handleChamCongNgay}>
            <div className="logo">
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <FontAwesomeIcon icon={icon.faCalendarCheck} />
              )}
            </div>
            <div className="text">Chấm công ngay!</div>
          </div>
          <div className="items off" onClick={handleNghihomnay}>
            <div className="logo">
              {loading3 ? (
                <div className="loading-spinner"></div>
              ) : (
                <FontAwesomeIcon icon={icon.faCalendarXmark} />
              )}
            </div>
            <div className="text">Hôm nay nghỉ!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayWork;
