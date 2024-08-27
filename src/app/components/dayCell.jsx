import React, {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import BangcongChitiet from './bangcong_date_popup';

const DayCell = ({ date, fulldate, inactive}) => {
  const [showPopup, setShowPopup] = useState(false);
  const handleDateClick = async () => {
    setShowPopup(true);
  };
  const handleHidePopup = (e) => {
    e.stopPropagation();
    setShowPopup(false); // Hide the popup
  };
  return (
    <td
      key={date}
      className={`table-cell ${inactive}`}
      onClick={handleDateClick}
    >
      <div className="text">{date}</div>
      {inactive === "active" && <FontAwesomeIcon icon={faCheck} className="active-icon" />}
      {inactive === "notactive" && <FontAwesomeIcon icon={faXmark} className="active-icon" />}
      {showPopup && (
        <div className="bg-page">
          <div className="detectOut" onClick={handleHidePopup}></div>
          <BangcongChitiet date={fulldate} />
        </div>
      )}
    </td>
  );
};

export default DayCell;
