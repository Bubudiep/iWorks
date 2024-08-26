import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import ApiClient from "./api";
import { useUser } from "../context/userContext";
import BangcongChitiet from './bangcong_date_popup';

function toDate(today = new Date()) {
  function pad(number, length) {
    return number.toString().padStart(length, "0");
  }
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${pad(month, 2)}-${pad(date, 2)}`;
}
const Bangcong = () => {
  const { userInfo, setUserInfo } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  // Tạo dữ liệu cho tất cả các ngày trong tháng với trạng thái không active
  const allDaysData = Array.from({ length: daysInMonth }, (_, i) => ({
    date: i + 1,
    active: false,
  }));
  const [selectedDate, setSelectedDate] = useState(null);
  const [daysData, setDaysData] = useState(allDaysData);
  const [isLoading, setIsLoading] = useState(false); // State để theo dõi trạng thái loading
  const popupRef = useRef(null);

  const fetchs = ApiClient();

  useEffect(() => {
    if (userInfo?.login?.token) {
      setIsLoading(true);
      const fetchData = async () => {
        const data = [];
        try {
          const response = await fetchs.gets(
            "/workrecord",
            userInfo.login.token
          );
          if (response.items) {
            const updatedDaysData = allDaysData.map((daydata) => {
              const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                daydata.date
              );
              const isActive = response.items.some(
                (item) => toDate(date) === toDate(new Date(item.workDate))
              );
              return isActive ? { date: daydata.date, active: true } : daydata;
            });
            setDaysData(updatedDaysData);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [userInfo, currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleMonthChange = (event) => {
    const newMonth = parseInt(event.target.value, 10);
    setCurrentDate(new Date(currentDate.getFullYear(), newMonth - 1, 1));
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  let weeks = [];
  let days = [];

  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push(<td key={`empty-${i}`}></td>);
  }
  if (daysData.length > 0) {
    daysData.forEach(({ date, active }, index) => {
      days.push(
        <td
          key={date}
          className={active ? "table-cell active" : "table-cell"}
          onClick={() => handleDateClick(date)}
        >
          <div className="text">{date}</div>
          {active && <FontAwesomeIcon icon={faCheck} className="active-icon" />}
        </td>
      );

      if (
        (index + adjustedFirstDay + 1) % 7 === 0 ||
        index === daysData.length - 1
      ) {
        while (days.length < 7) {
          days.push(<td key={`empty-${days.length + index + 1}`}></td>);
        }
        weeks.push(<tr key={`week-${weeks.length}`}>{days}</tr>);
        days = [];
      }
    });
  }

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthName = new Date(
      currentDate.getFullYear(),
      month - 1
    ).toLocaleString("default", { month: "long" });
    return (
      <option key={month} value={month}>
        {monthName}
      </option>
    );
  });

  const handleClickOutside = (event) => {
    if (
      event.button === 0 &&
      popupRef.current &&
      !popupRef.current.contains(event.target)
    ) {
      setSelectedDate(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateClick = async (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(toDate(date));
  };

  const formatDate = (day) => {
    if (!selectedDate) return "";
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="lich-bangcong">
      <div className="bangcong-thang">
        <button className="pre" onClick={goToPreviousMonth}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <select onChange={handleMonthChange} value={currentDate.getMonth() + 1}>
          {monthOptions}
        </select>
        <button className="next" onClick={goToNextMonth}>
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
      {isLoading ? (
        <div className="ninebox">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              {[
                "Thứ 2",
                "Thứ 3",
                "Thứ 4",
                "Thứ 5",
                "Thứ 6",
                "Thứ 7",
                "Chủ nhật",
              ].map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>{weeks}</tbody>
        </table>
      )}
      {selectedDate !== null && <BangcongChitiet date={selectedDate} />}
    </div>
  );
};

export default Bangcong;
