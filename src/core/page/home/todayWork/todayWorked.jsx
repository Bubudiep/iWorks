import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import ApiClient from "../../../../components/api";
import { useUser } from "../../../context/userContext";
import Working from "../../../../img/working.png";
import UpdateTodayWork from "./todayWork_update"; // Import the popup component

function pad(number, length) {
  return number.toString().padStart(length, "0");
}

function toDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${pad(month, 2)}-${pad(date, 2)}`;
}
let luongHomnay = 0,
  chuyenCan = 0,
  tangCa = 0,
  phuCapkhac = 0;
const TodayWorked = () => {
  console.log(`TodayWorked`);
  const { userInfo, setUserInfo } = useUser();
  const [loading, setLoading] = useState(false);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [lateHours, setLateHours] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  useEffect(() => {
    userInfo?.reCord.forEach((rc) => {
      if (rc.workDate == toDate()) {
        setStartTime(
          rc.startTime
            ? rc.startTime.replace(":00", "")
            : toDate() + " 08:00:00"
        );
        setEndTime(
          rc.endTime ? rc.endTime.replace(":00", "") : toDate() + " 17:00:00"
        );
        setLateHours(rc.lateTime);
        setOvertimeHours(rc.overTime);
      }
    });
  }, []);
  const fetchData = ApiClient();
  const handleShowPopup = () => {
    setShowPopup(true); // Show the popup
  };
  const handleHidePopup = () => {
    setShowPopup(false); // Show the popup
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
  const handleUpdatework = async () => {
    setLoading2(true);
    if (userInfo.reCord) {
      userInfo.reCord.forEach(async (record) => {
        if (record.workDate == toDate()) {
          try {
            // Call the API to update user info
            const updatecong = await fetchData.patch(
              `/workrecord/${record.id}`,
              {
                startTime: (startTime + ":00").replace("T", " "),
                endTime: (endTime + ":00").replace("T", " "),
                overTime: overtimeHours, // Add the overtime hours
                lateTime: lateHours, // Add the late hours
              },
              userInfo.login.token
            );
            if (updatecong) {
              const response = await fetchData.gets(
                "/workrecord?per_page=999&month=" +
                  (new Date().getMonth() + 1) +
                  "&year=" +
                  new Date().getFullYear(),
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
    }
  };
  // Mảng chứa các câu ngẫu nhiên
  const messages = [
    "Nút cập nhập giờ để thêm giờ tăng ca, vào muộn, điều chỉnh lại giờ ra và vào!",
    "Hôm nay nghỉ để chuyển hôm nay thành không đi làm",
    "Để thêm giờ ra, vào bạn hãy chọn Cập nhập giờ",
    "Trung bình tiền lương 1 ngày của bạn là ***",
    "Chuyên cần là khi bạn đi làm đủ số ngày quy định của công ty (thường sẽ là 26, bạn sẽ được thưởng)",
    "Chúc bạn một ngày làm việc vui vẻ!",
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
            <div className="h5">Cập nhập giờ hôm nay</div>
            <div className="g5">
              <div className="summary form-group">
                <div className="items-flex">
                  <div className="h-name">Giờ công</div>
                  <div className="h-input">
                    <input type="number" placeholder="0" defaultValue={8} />
                    <div className="sub-input">Tiếng</div>
                  </div>
                </div>
                <div className="items-flex">
                  <div className="h-name">Tăng ca</div>
                  <div className="h-input">
                    <input
                      type="number"
                      placeholder="0"
                      value={overtimeHours}
                      onChange={(e) => setOvertimeHours(e.target.value)}
                    />
                    <div className="sub-input">Tiếng</div>
                  </div>
                </div>
                <div className="items-flex">
                  <div className="h-name">Vào muộn</div>
                  <div className="h-input">
                    <input
                      type="number"
                      placeholder="0"
                      value={lateHours}
                      onChange={(e) => setLateHours(e.target.value)}
                    />
                    <div className="sub-input">Tiếng</div>
                  </div>
                </div>
                <div className="items-flex">
                  <div className="h-name">Tiền thưởng</div>
                  <div className="h-input">
                    <input
                      type="number"
                      placeholder="0"
                      // value={lateHours}
                      // onChange={(e) => setLateHours(e.target.value)}
                    />
                    <div className="sub-input">VND</div>
                  </div>
                </div>
                <div className="items-flex">
                  <div className="h-name">Giờ vào</div>
                  <div className="h-input">
                    <input
                      type="datetime-local"
                      value={startTime ?? toDate() + " 08:00:00"}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="items-flex">
                  <div className="h-name">Giờ ra</div>
                  <div className="h-input">
                    <input
                      type="datetime-local"
                      value={endTime ?? toDate() + " 17:00:00"}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
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
            <img src={Working} />
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
              <div className="text">Cập nhật giờ!</div>
            </div>
            <div className="items off" onClick={handleNghihomnay}>
              <div className="logo">
                {loading3 ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <FontAwesomeIcon icon={icon.faCalendar} />
                )}
              </div>
              <div className="text">Hôm nay nghỉ!</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodayWorked;
