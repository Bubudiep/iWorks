import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faAngleLeft,
  faAngleRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import ApiClient from "./api";
import { useUser } from "../context/userContext";
import DayCell from "./dayCell";

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
    active: 'idle',
  }));
  const [daysData, setDaysData] = useState(allDaysData);
  const [isLoading, setIsLoading] = useState(false); // State để theo dõi trạng thái loading

  const fetchs = ApiClient();

  useEffect(() => {
    if (userInfo?.login?.token) {
      console.log("Reload loading...");
      setIsLoading(true);
      const fetchData = async () => {
        const data = [];
        try {
          const response = await fetchs.gets(
            "/workrecord?per_page=999&month="+(currentDate.getMonth()+1)+"&year="+currentDate.getFullYear(),
            userInfo.login.token
          );
          if (response.items) {
            const updatedDaysData = allDaysData.map((daydata) => {
              const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                daydata.date
              );
              const matchingItem = response.items.find(
                (item) => toDate(date) === toDate(new Date(item.workDate))
              );

              if (matchingItem) {
                return {
                  date: daydata.date,
                  active: matchingItem.isWorking ? 'true' : 'false',
                };
              }

              return daydata;
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
      const inactive = active === "true" ? "active" : active === "false" ? "notactive" : "";
      
      const fulldate = toDate(new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        date
      ));
      days.push(
        <DayCell
          key={date}
          date={date}
          fulldate={fulldate}
          inactive={inactive}
        />
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
    </div>
  );
};

export default Bangcong;
