import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";

const MoneyCard = () => {
  const [isViewed, setIsViewed] = useState(false);
  const [isViewed2, setIsViewed2] = useState(false);

  const handleViewToggle = () => {
    setIsViewed(!isViewed);
  };
  const handleViewToggle2 = () => {
    setIsViewed2(!isViewed2);
  };

  const amount = 99000000000;
  const amount2 = 112000000000;
  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
  };

  return (
    <div className="listCard">
      <div className="MoneyCard">
        <div className="company">Tên công ty</div>
        <div className="money">
          <div className="amount">
            {isViewed ? formatCurrency(amount) : "••• ••• •••"}
          </div>
          <div className="view" onClick={handleViewToggle}>
            <FontAwesomeIcon icon={isViewed ? icon.faEye : icon.faEyeSlash} />
          </div>
        </div>
        <Link to="/caidat_Luong" className="caidat">
          <div className="txt">Chi tiết bảng lương</div>
          <div className="icon">
            <FontAwesomeIcon icon={icon.faAngleRight} />
          </div>
        </Link>
      </div>
      <div className="MoneyCard">
        <div className="company">Lương tháng dự kiến</div>
        <div className="money">
          <div className="amount">
            {isViewed2 ? formatCurrency(amount2) : "••• ••• •••"}
          </div>
          <div className="view" onClick={handleViewToggle2}>
            <FontAwesomeIcon icon={isViewed2 ? icon.faEye : icon.faEyeSlash} />
          </div>
        </div>
        <Link to="/caidat_Luong" className="caidat">
          <div className="txt">Tùy chỉnh dự kiến</div>
          <div className="icon">
            <FontAwesomeIcon icon={icon.faAngleRight} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MoneyCard;
