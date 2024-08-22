import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../context/userContext";
import ApiClient from "../components/api";

function toDate(today = new Date()) {
  function pad(number, length) {
    return number.toString().padStart(length, "0");
  }
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  console.log(`${year}-${month}-${date}`);
  return `${year}-${pad(month, 2)}-${pad(date, 2)}`;
}

const UpdateTodayWork = () => {
  const { userInfo, setUserInfo } = useUser();
  const fetchData = ApiClient();
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [lateHours, setLateHours] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleUpdatework = async () => {
    setLoading(true);
    if (
      userInfo?.workSheet?.items.length > 0 &&
      userInfo?.workSheet?.items[0]?.WorkRecord
    )
      userInfo?.workSheet?.items[0]?.WorkRecord.forEach(async (record) => {
        console.log(record);
        if (record.workDate == toDate()) {
          try {
            // Call the API to update user info
            const updatecong = await fetchData.patch(
              `/workrecord/${record.id}`,
              {
                overTime: overtimeHours, // Add the overtime hours
                lateTime: lateHours, // Add the late hours
              },
              userInfo.login.token
            );
            if (updatecong) {
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
          } finally {
            setLoading(false); // End loading
          }
        }
      });
  };
  return (
    <div className="bg-page">
      <div className="message-container single">
        <div className="message g5">
          <div className="name pd5">Hôm nay bạn có tăng ca không?</div>
          <div className="summary form-group">
            <div className="h-name">Tăng ca</div>
            <div className="h-input">
              <input
                type="number"
                placeholder="0"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value)}
              />{" "}
              <div className="sub-input">Tiếng</div>
            </div>
            <div className="h-name">Vào muộn</div>
            <div className="h-input">
              <input
                type="number"
                placeholder="0"
                value={lateHours}
                onChange={(e) => setLateHours(e.target.value)}
              />{" "}
              <div className="sub-input">Tiếng</div>
            </div>
          </div>
        </div>
        <div className="options">
          <div className="items active" onClick={handleUpdatework}>
            <div className="logo">
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <FontAwesomeIcon icon={icon.faCheck} />
              )}
            </div>
            <div className="text">Lưu lại</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTodayWork;
