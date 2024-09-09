import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import ApiClient from "../components/api";
import { useUser } from "../context/userContext";

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
let luongHomnay = 0,
  chuyenCan = 0,
  tangCa = 0,
  phuCapkhac = 0;
const TodayWork = () => {
  const { userInfo, setUserInfo } = useUser();
  const [loading, setLoading] = useState(false);
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
  const checkWorkmoney = () => {
    (luongHomnay = 0), (chuyenCan = 0), (tangCa = 0), (phuCapkhac = 0);
    if (userInfo.workSheet.length > 0) {
      var totalSalary = 0,
        fixedSalary = 0;
      userInfo.workSheet.WorkSalary.forEach((items) => {
        if (items.isMonthly == false) {
          totalSalary += items.Salary;
        } else {
          if (items.SalaryName == "Chuyên cần") {
            fixedSalary += items.Salary;
          } else {
            phuCapkhac += items.Salary;
          }
        }
      });
      userInfo?.workSheet?.items[0]?.WorkRecord.forEach(async (record) => {
        if (record.workDate == toDate()) {
          tangCa = record.overTime * Math.round(totalSalary / 26 / 8);
        }
      });
      luongHomnay = Math.round(totalSalary / 26);
      chuyenCan = fixedSalary;
    }
  };
  checkWorkmoney();
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "VND")
      .replaceAll(".", ",");
  };
  return (
    <div className="pd0x10">
      <div className="message-container">
        <div className="message">
          <div className="content">Hôm nay bạn có đi làm không?</div>
          <div className="flex g5">
            <div className="card">
              <div className="name">Tiền lương</div>
              <div className="money">{formatCurrency(luongHomnay)}</div>
            </div>
            <div className="fc f1 card">
              <div className="name">Chuyên cần</div>
              <div className="money">{formatCurrency(chuyenCan)}</div>
            </div>
            <div className="fc f1 card">
              <div className="name">Khác</div>
              <div className="money">{formatCurrency(phuCapkhac)}</div>
            </div>
          </div>
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
