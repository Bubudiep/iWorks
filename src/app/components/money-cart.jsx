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
    }).format(amount);
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
                  ? formatCurrency(item.total_salary ? item.total_salary : 0)
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
