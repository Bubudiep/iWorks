import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import ApiClient from "./api";
import Popup from "./popup"; // Import component popup
import { useUser } from "../context/userContext";

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
function toDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  console.log(`${year}-${month}-${date}`);
  return `${year}-${pad(month, 2)}-${pad(date, 2)}`;
}

const MoneyCard = () => {
  const { userInfo, setUserInfo } = useUser();
  const [workSheet, setWorkSheet] = useState([]); // Sử dụng mảng để lưu các item từ API
  const [isLoading, setIsLoading] = useState(true);
  const [isViewed, setIsViewed] = useState(false); // Kiểm soát trạng thái hiển thị số tiền
  useEffect(() => {
    if (userInfo?.workSheet?.items) {
      console.log(userInfo?.workSheet?.items);
      setIsLoading(false);
      setWorkSheet(userInfo.workSheet.items);
    } else {
      setWorkSheet([]);
    }
  }, [userInfo]);
  const handleViewToggle = () => {
    setIsViewed((prev) => !prev);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount).replace("₫","VND").replaceAll(".",",");;
  };
  const calculateSalary = (workSalary, workRecord) => {
    if (!workSalary || !workRecord) return 0;
    var totalSalary = 0;
    var fixedSalary = 0;
    var workHours=0, OT=0, CN=0;
    var songaycong=0;
    var calamviec=0, ngaynghi=0;
    if (userInfo.workSheet.items[0].Calamviec=="2Ca") calamviec = 1;
    if (userInfo.workSheet.items[0].NgayNghi=="T7CN") ngaynghi = 1;
    workRecord.forEach(record => {
      if (record.isWorking) {
        songaycong++;
        var thisWorktime=8;
        if (
          ngaynghi==0&&new Date(record.workDate).getDay()==0 ||
          ngaynghi==1&&new Date(record.workDate).getDay()==0 ||
          ngaynghi==1&&new Date(record.workDate).getDay()==6
        ){ // Đi làm chủ nhật
          if (record.startTime!=null && record.endTime!=null) {
            thisWorktime=(new Date(record.endTime)-new Date(record.startTime)) / (1000 * 60 * 60);
            thisWorktime=thisWorktime-1 // giờ giải lao
          } else {
            thisWorktime = thisWorktime-record.lateTime;
          }
          CN += thisWorktime;
        } else { // Đi làm ngày thường
          if (record.startTime!=null && record.endTime!=null) {
            thisWorktime=(new Date(record.endTime)-new Date(record.startTime)) / (1000 * 60 * 60);
            thisWorktime=thisWorktime-1 // giờ giải lao
          } else {
            thisWorktime = thisWorktime-record.lateTime;
          }
          console.log(thisWorktime);
          workHours += thisWorktime;
        }
        OT+=record.overTime;
      }
    })
    workSalary.forEach(items=>{
      if (items.isMonthly==false){
        totalSalary+=items.Salary;
      } else {
        fixedSalary+=items.Salary;
      }
    })
    var luong1gio=Math.round(totalSalary/26/8);
    var luongTonggiolam=luong1gio*workHours;
    var luongTangca=luong1gio*OT*1.5;
    var luongCN=CN*luong1gio*2;
    if (songaycong<26) fixedSalary=0;
    var tongLuong=luongTonggiolam+luongTangca+fixedSalary+luongCN;
    console.log({
      Luong1Gio:luong1gio,
      LuongVaPhucaptheogio:totalSalary,
      PhucapCodinh:fixedSalary,
      SogioDilam:workHours,
      SogioTangCa:OT,
      LuongDilam:luongTonggiolam,
      LuongTangca:luongTangca,
      luongCN:luongCN,
      TongLuong:tongLuong
    })
    return tongLuong;
    // const basicDailySalary = workSalary / 26; // Lương cơ bản chia cho 26 công
    // const hourlyRate = basicDailySalary / 8; // Chia cho 8 giờ làm việc
    // const totalHoursWorked = workRecord.reduce((acc, record) => acc + record.hours, 0); // Tổng số giờ làm việc

    // return hourlyRate * totalHoursWorked;
  };
  return (
    <div className="listCard">
      {isLoading ? (
        <div className="MoneyCard">
          <div className="f1 acenter">
            <div className="leap-frog">
              <div className="leap-frog__dot"></div>
              <div className="leap-frog__dot"></div>
              <div className="leap-frog__dot"></div>
            </div>
          </div>
        </div>
      ) : (
        workSheet.map((item, index) => (
          <div key={index} className="MoneyCard">
            <div className="company">{item.Company}</div>
            <div className="money">
              <div className="amount">
                {isViewed
                  ? formatCurrency(calculateSalary(item.WorkSalary, item.WorkRecord))
                  : "••• ••• •••"}
              </div>
              <div className="view" onClick={handleViewToggle}>
                <FontAwesomeIcon
                  icon={isViewed ? icon.faEye : icon.faEyeSlash}
                />
              </div>
            </div>
            <Link to={`/luong/${item.id}`} className="caidat">
              <div className="txt">Chi tiết bảng lương</div>
              <div className="icon">
                <FontAwesomeIcon icon={icon.faAngleRight} />
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default MoneyCard;
