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
  const [detailInfo, setDetailInfo] = useState(null); // Thông tin chi tiết
  const popupRef = useRef(null);

  // Hàm để tạo dữ liệu active ngẫu nhiên
  const generateDayData = (days) => {
    return days.map((day) => ({
      date: day,
      active: Math.random() > 0.5, // Random true or false
    }));
  };

  useEffect(() => {
    // Cập nhật dữ liệu khi tháng thay đổi
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    setDaysData(
      generateDayData(Array.from({ length: daysInMonth }, (_, i) => i + 1))
    );
  }, [currentDate]);

  // Hàm để chuyển đến tháng trước
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Hàm để chuyển đến tháng sau
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Hàm để thay đổi tháng từ dropdown
  const handleMonthChange = (event) => {
    const newMonth = parseInt(event.target.value, 10);
    setCurrentDate(new Date(currentDate.getFullYear(), newMonth - 1, 1));
  };

  // Hàm để lấy ngày đầu tiên của tháng
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  // Điều chỉnh để tuần bắt đầu từ thứ Hai
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  let weeks = [];
  let days = [];

  // Điền các ô trống vào tuần đầu tiên nếu cần thiết
  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push(<td key={`empty-${i}`}></td>);
  }

  // Điền các ngày của tháng
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

    // Nếu tuần đã đầy, thêm tuần vào mảng weeks và bắt đầu tuần mới
    if (
      (index + adjustedFirstDay + 1) % 7 === 0 ||
      index === daysData.length - 1
    ) {
      // Điền các ô trống vào tuần cuối cùng nếu cần thiết
      while (days.length < 7) {
        days.push(<td key={`empty-${days.length + index + 1}`}></td>);
      }
      weeks.push(<tr key={`week-${weeks.length}`}>{days}</tr>);
      days = [];
    }
  });

  // Tạo các tùy chọn cho tháng trong dropdown
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

  // Xử lý việc đóng popup khi bấm ra ngoài
  const handleClickOutside = (event) => {
    // Kiểm tra nếu click chuột trái và bấm ra ngoài popup
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

  // Xử lý sự kiện khi nhấp vào một ngày
  const handleDateClick = (day) => {
    // Dữ liệu demo cho ngày được chọn
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

  // Định dạng ngày đầy đủ
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

      {/* Popup */}
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
