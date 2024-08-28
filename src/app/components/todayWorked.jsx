import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import ApiClient from "../components/api";
import { useUser } from "../context/userContext";
import Working from "../img/working.png";
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
let luongHomnay = 0,chuyenCan = 0,tangCa = 0, phuCapkhac=0;
const TodayWorked = () => {
  const { userInfo, setUserInfo } = useUser();
  const [loading, setLoading] = useState(false);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [lateHours, setLateHours] = useState(0);
  const [loading2, setLoading2] = useState(false);
  const [fadeOut, setFadeOut] = useState(false); // State for fade out effect
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // Trigger fade out after 2 seconds
    }, 2000);
    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);
  const fetchData = ApiClient();
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
          "/worksheet_list_details",
          userInfo.login.token
        );
        setUserInfo((prevUser) => ({ ...prevUser, workSheet: response }));
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
    if (
      userInfo?.workSheet?.items.length > 0 &&
      userInfo?.workSheet?.items[0]?.WorkRecord
    ) {
      userInfo?.workSheet?.items[0]?.WorkRecord.forEach(async (record) => {
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
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount).replace("₫","VND").replaceAll(".",",");;
  };
  const checkWorkmoney = () => {
    luongHomnay = 0,chuyenCan = 0,tangCa = 0, phuCapkhac=0;
    if (userInfo?.workSheet?.items.length > 0) {
      var totalSalary=0, fixedSalary=0;
      userInfo.workSheet.items[0].WorkSalary.forEach(items=>{
        if (items.isMonthly==false){
          totalSalary+=items.Salary;
        } else {
          if (items.SalaryName=="Chuyên cần"){
            fixedSalary+=items.Salary
          } else {
            phuCapkhac+=items.Salary
          }
        }
      })
      userInfo?.workSheet?.items[0]?.WorkRecord.forEach(async (record) => {
        if (record.workDate == toDate()) {
          tangCa=(record.overTime)*Math.round(totalSalary/26/8)
        }
      });
      luongHomnay=Math.round(totalSalary/26);
      chuyenCan=fixedSalary;
    }
  };
  checkWorkmoney();
  return (
    <div className="pd0x10">
      {showPopup && (
        <div className="bg-page">
          <div className="detectOut" onClick={handleHidePopup}></div>
          <div className="message-container single">
            <div className="h5">Chi tiết lương hôm nay</div>
            <div className="message g5">
              <div className="summary form-group">
                <div className="items-flex">
                  <div className="h-name">Giờ vào</div>
                  <div className="h-input">
                    <input
                      type="time"
                      defaultValue="08:00:00"
                      // value={overtimeHours}
                      // onChange={(e) => setOvertimeHours(e.target.value)}
                    />
                  </div>
                </div>
                <div className="items-flex">
                  <div className="h-name">Giờ ra</div>
                  <div className="h-input">
                    <input
                      type="time"
                      defaultValue="17:00:00"
                      // value={overtimeHours}
                      // onChange={(e) => setOvertimeHours(e.target.value)}
                    />
                  </div>
                </div>
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
      <div className="message-container">
        <div className="message">
          <div className="logos">
            <img src={Working} />
          </div>
          <div className="salary">+{formatCurrency(luongHomnay+tangCa+chuyenCan+phuCapkhac)}</div>
          <div className="flex g5">
            <div className="card">
              <div className="name">Lương</div>
              <div className="salary2">+{formatCurrency(luongHomnay+tangCa)}</div>
            </div>
            <div className="fc f1 card">
              <div className="name">Chuyên cần</div>
              <div className="salary2">+{formatCurrency(chuyenCan)}</div>
            </div>
            <div className="fc f1 card">
              <div className="name">Khác</div>
              <div className="salary2">+{formatCurrency(phuCapkhac)}</div>
            </div>
          </div>
        </div>
        <div className="options2" onClick={handleShowPopup}>
          <div className={`text ${fadeOut ? "fade-out" : ""}`}>Cài đặt</div>
          <FontAwesomeIcon icon={icon.faGear} />
        </div>
      </div>
    </div>
  );
};

export default TodayWorked;
