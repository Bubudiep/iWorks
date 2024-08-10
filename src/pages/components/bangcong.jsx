import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

const Bangcong = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [daysData, setDaysData] = useState([]);
  const [detailInfo, setDetailInfo] = useState(null);
  const popupRef = useRef(null);

  // Hàm lấy giá trị cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  useEffect(() => {
    const fetchData = async () => {
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

      // Lấy token từ cookie
      const token = getCookie('iwtoken');
      const data = [];
      try {
        const response = await fetch(`/api/days-data?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        data = await response.json();
      } catch (error) {
        console.error("Error fetching data", error);
      }
      const updatedDaysData = allDaysData.map(day => ({
        ...day,
        active: data.some(activeDay => activeDay.date === day.date && activeDay.active)
      }));
      console.log(updatedDaysData);
      setDaysData(updatedDaysData);
    };

    fetchData();
  }, [currentDate]);

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

  const handleDateClick = (day) => {
    const demoData = {
      checkIn: `07:56:02 sáng`,
      checkOut: `17:22:01 chiều`,
      overtime: `02:20:52`,
      late: `-`,
      notes: `Làm việc ngoài giờ để hoàn thành dự án.`,
    };
    setDetailInfo(demoData);
    setSelectedDate(day);
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

      {selectedDate !== null && detailInfo && (
        <div className="popup">
          <div className="popup-content" ref={popupRef}>
            <div className="title">
              <div className="text">{formatDate(selectedDate)}</div>
              <div className="close" onClick={() => setSelectedDate(null)}>
                &times;
              </div>
            </div>
            <div className="details">
              <table>
                <tbody>
                  <tr>
                    <td>Giờ vào</td>
                    <td>{detailInfo.checkIn}</td>
                  </tr>
                  <tr>
                    <td>Giờ ra</td>
                    <td>{detailInfo.checkOut}</td>
                  </tr>
                  <tr>
                    <td>Tăng ca</td>
                    <td>{detailInfo.overtime}</td>
                  </tr>
                  <tr>
                    <td>Vào muộn</td>
                    <td>{detailInfo.late}</td>
                  </tr>
                  <tr>
                    <td>Ghi chú</td>
                    <td>{detailInfo.notes}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bangcong;
