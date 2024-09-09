import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import ApiClient from "../../../../components/api";
import { useUser } from "../../../context/userContext";
import WorkOff from "../../../../img/holiday.png";
import UpdateTodayWork from "./todayWork_update"; // Import the popup component

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
const TodayWorkOff = () => {
  const { userInfo, setUserInfo } = useUser();
  const [loading, setLoading] = useState(false);
  const [offRate, setOffRate] = useState(0);
  const [bonusSalary, setBonusSalary] = useState(0);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [fadeOut, setFadeOut] = useState(false); // State for fade out effect
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [leaveType, setLeaveType] = useState(0);

  useEffect(() => {
    if (userInfo.reCord) {
      userInfo.reCord.forEach(async (record) => {
        if (record.workDate == toDate()) {
          setOffRate(record.offRate ?? 0);
          setBonusSalary(record.bonusSalary ?? 0);
          setLeaveType(record.leaveType ?? 0);
        }
      });
    }
    const timer = setTimeout(() => {
      setFadeOut(true); // Trigger fade out after 2 seconds
    }, 2000);
    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);
  const fetchData = ApiClient();
  const handleChamCongNgay = async () => {
    setLoading3(true); // Start loading
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
  const handleShowPopup = () => {
    setShowPopup(true); // Show the popup
  };
  const handleHidePopup = () => {
    setShowPopup(false); // Show the popup
  };
  const handleUpdatework = async () => {
    setLoading2(true);
    if (userInfo.reCord)
      userInfo.reCord.forEach(async (record) => {
        if (record.workDate == toDate()) {
          try {
            // Call the API to update user info
            const updatecong = await fetchData.patch(
              `/workrecord/${record.id}`,
              {
                leaveType: leaveType, // Add the overtime hours
                offRate: offRate, // Add the late hours
                bonusSalary: bonusSalary,
              },
              userInfo.login.token
            );
            if (updatecong) {
              const response = await fetchData.gets(
                "/workrecord",
                userInfo.login.token
              );
              setUserInfo((prevUser) => ({
                ...prevUser,
                reCord: response.items,
              }));
              setShowPopup(false); // Trigger fade out after 2 seconds
            } else {
              console.error("Failed to update user info");
            }
          } catch (error) {
            console.error("Error calling the API:", error);
          } finally {
            setLoading2(false); // End loading
          }
        }
      });
  };
  // Mảng chứa các câu ngẫu nhiên
  const messages = [
    "Nghỉ ngơi luôn là một lựa chọn tuyệt vời!",
    "Một ngày nghỉ bằng 10 thang thuốc bổ",
    "Kiểu nghỉ để bạn chọn nghỉ có phép hoặc không phép hoặc công ty cho nghỉ!",
    "Trung bình tiền lương 1 ngày của bạn là ***",
    "Chuyên cần là khi bạn đi làm đủ số ngày quy định của công ty (thường sẽ là 26, bạn sẽ được thưởng)",
    "Chúc bạn một ngày nghỉ vui vẻ!",
    "Tam Đảo là một nơi đẹp, bạn rảnh có thể đi chơi thử!",
    "Hôm này trời thật đẹp, bạn cũng vậy!",
  ];

  // Chọn ngẫu nhiên một câu chào từ mảng
  const [randomMessage, setRandomMessage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setRandomMessage(messages[randomIndex]);
  }, []); // Chỉ chạy một lần khi component được mount
  return (
    <>
      {showPopup && (
        <div className="bg-page">
          <div className="detectOut" onClick={handleHidePopup}></div>
          <div className="message-container single">
            <div className="h5">Kiểu nghỉ</div>
            <div className="g5">
              <div className="form-group">
                <div className="items-flex">
                  <div className="h-name">Kiểu nghỉ</div>
                  <div className="h-input">
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(Number(e.target.value))}
                    >
                      <option value={0}>Không phép</option>
                      <option value={1}>Có phép</option>
                      <option value={2}>Hưởng lương</option>
                      <option value={3}>Nghỉ ốm</option>
                    </select>
                  </div>
                </div>
                {leaveType === 2 && (
                  <div className="items-flex">
                    <div className="h-name">Lương hưởng</div>
                    <div className="h-input">
                      <input
                        type="number"
                        placeholder="0"
                        value={offRate}
                        onChange={(e) => setOffRate(e.target.value)}
                      />
                      <div className="sub-input">%</div>
                    </div>
                  </div>
                )}
                <div className="items-flex">
                  <div className="h-name">Tiền thưởng khác</div>
                  <div className="h-input">
                    <input
                      type="number"
                      placeholder="0"
                      value={bonusSalary}
                      onChange={(e) => setBonusSalary(e.target.value)}
                    />
                    <div className="sub-input">VND</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="options">
              <div className="items active" onClick={handleUpdatework}>
                <div className="logo">
                  {loading2 ? (
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
      )}

      <div className="top10">
        <div className="message-container">
          <div className="logo">
            <img src={WorkOff} />
          </div>
          <div className="message">
            <div className="content">{randomMessage}</div>
          </div>
          <div className="options">
            <div className="items active" onClick={handleShowPopup}>
              <div className="logo">
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <FontAwesomeIcon icon={icon.faGear} />
                )}
              </div>
              <div className="text">Kiểu nghỉ!</div>
            </div>
            <div className="items active" onClick={handleChamCongNgay}>
              <div className="logo">
                {loading3 ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <FontAwesomeIcon icon={icon.faCalendar} />
                )}
              </div>
              <div className="text">Hôm nay đi làm!</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodayWorkOff;
