import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import ApiClient from "../components/api";
import { useUser } from "../context/userContext";

function pad(number, length) {
  return number.toString().padStart(length, "0");
}

function toDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  console.log(`${year}-${month}-${date}`);
  return `${year}-${pad(month, 2)}-${pad(date, 2)}`;
}
const TodayWork = () => {
  const { userInfo, setUserInfo } = useUser();
  const fetchData = ApiClient();
  const handleChamCongNgay = async () => {
    console.log(userInfo);
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
          "/worksheet_list_details",
          userInfo.login.token
        );
        setUserInfo((prevUser) => ({ ...prevUser, workSheet: response }));
        console.log(userInfo);
      } else {
        console.error("Failed to update user info");
      }
    } catch (error) {
      console.error("Error calling the API:", error);
    }
  };
  return (
    <div className="pd0x10">
      <div className="message-container">
        <div className="message">
          {/* <div className="name">Tiền chuyên cần và lương hôm nay </div>
          <div className="money">900,000</div> */}

          <div className="flex g5">
            <div className="card">
              <div className="name">Tiền lương</div>
              <div className="money">900,000 VNĐ</div>
            </div>
            <div className="fc f1 card">
              <div className="name">Chuyên cần</div>
              <div className="money">900,000 VNĐ</div>
            </div>
          </div>
          <div className="content">Hôm nay bạn có đi làm không?</div>
        </div>
        <div className="options">
          <div className="items active" onClick={handleChamCongNgay}>
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
  );
};

export default TodayWork;
