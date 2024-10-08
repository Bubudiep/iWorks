import React, { useState, useEffect, useRef } from "react";
import ApiClient from "../../../components/api";
import { useUser } from "../../context/userContext";

const BangcongChitiet = ({ date }) => {
  const { userInfo, setUserInfo } = useUser();
  const fetchs = ApiClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [startTime, setStartTime] = useState(date + " 08:00");
  const [endTime, setEndTime] = useState(date + " 17:00");
  const [overTime, setOverTime] = useState(0);
  const [lateTime, setLateTime] = useState(0);
  const [leaveType, setLeaveType] = useState(0);
  const [salaryRatio, setSalaryRatio] = useState(100);
  const [dateId, setDateId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    if (date) checkDate(date);
  }, [date]);
  const handleChamCongNgay = async () => {
    setLoading2(true);
    try {
      const chamcong = await fetchs.post(
        "/cham-cong-ngay",
        { workDate: date },
        userInfo.login.token
      );
      if (chamcong?.result === "pass") {
        const response = await fetchs.gets(
          "/workrecord?per_page=999&month=" +
            (new Date(date).getMonth() + 1) +
            "&year=" +
            new Date(date).getFullYear(),
          userInfo.login.token
        );
        await response.items.forEach((details) => {
          if (details.workDate == date) {
            setDateId(details.id);
          }
        });
        setUserInfo((prevUser) => ({ ...prevUser, reCord: response.items }));
        setShowForm(true);
        setIsWorking(true);
      }
    } catch (error) {
      console.error("Error calling the API:", error);
    } finally {
      setLoading2(false);
    }
  };

  const handleNghihomnay = async () => {
    setLoading3(true);
    try {
      const chamcong = await fetchs.post(
        "/nghi-viec-ngay",
        { workDate: date },
        userInfo.login.token
      );
      if (chamcong?.result === "pass") {
        const response = await fetchs.gets(
          "/workrecord?per_page=999&month=" +
            (new Date(date).getMonth() + 1) +
            "&year=" +
            new Date(date).getFullYear(),
          userInfo.login.token
        );
        await response.items.forEach((details) => {
          if (details.workDate == date) {
            setDateId(details.id);
          }
        });
        setUserInfo((prevUser) => ({ ...prevUser, reCord: response.items }));
        setShowForm(true);
        setIsWorking(false);
      }
    } catch (error) {
      console.error("Error calling the API:", error);
    } finally {
      setLoading3(false);
    }
  };

  const checkDate = async (date) => {
    setShowPopup(true);
    setLoading(true);
    try {
      const response = await fetchs.gets(
        `/workrecord?workDate=${date}`,
        userInfo.login.token
      );
      if (response.items.length === 1) {
        const record = response.items[0];
        setIsWorking(record.isWorking);
        setDateId(record.id);
        if (record.startTime) setStartTime(record.startTime.replace(":00", ""));
        if (record.endTime) setEndTime(record.endTime.replace(":00", ""));
        setOverTime(record.overTime || 0);
        setLateTime(record.lateTime || 0);
        setShowForm(true);
        setTitle(
          `Ngày ${new Date(date).getDate()} tháng ${
            new Date(date).getMonth() + 1
          }`
        );
        setMessage("");
      } else {
        setShowForm(false);
        setTitle(
          `Ngày ${new Date(date).getDate()} tháng ${
            new Date(date).getMonth() + 1
          }`
        );
        setMessage(`Bạn chưa chấm công!`);
      }
    } catch (error) {
      setShowForm(false);
      setMessage("Phát sinh lỗi khi kết nối dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatedilam = async () => {
    setLoading2(true);
    try {
      const updateData = {
        startTime: (startTime + ":00").replace("T", " "),
        endTime: (endTime + ":00").replace("T", " "),
        overTime,
        lateTime,
      };
      await fetchs.patch(
        `/workrecord/${dateId}`,
        updateData,
        userInfo.login.token
      );
      const response = await fetchs.gets(
        "/workrecord?per_page=999&month=" +
          (new Date(date).getMonth() + 1) +
          "&year=" +
          new Date(date).getFullYear(),
        userInfo.login.token
      );
      setUserInfo((prevUser) => ({ ...prevUser, reCord: response.items }));
      console.log(userInfo);
      await setSuccessMessage("Cập nhật thành công!");
      setInterval(() => setSuccessMessage(false), 2000);
      // Set success message
    } catch (error) {
      console.error("Error updating work record:", error);
    } finally {
      setLoading2(false);
    }
  };

  const handleUpdatengay = async () => {
    // Add logic for updating leave details here
  };

  return (
    showPopup && (
      <div className="show-card w90 mini">
        {loading ? (
          <div className="flex acenter message2">
            <div className="loading-spinner"></div>
          </div>
        ) : showForm ? (
          isWorking ? (
            <div className="fc">
              <div className="title2">
                <div className="text">Đi làm - {title}</div>
                <div className="dateType">
                  <select>
                    <option>Ngày thường</option>
                    <option>Ngày nghỉ</option>
                    <option>Ngày lễ</option>
                    <option>Ngày phép</option>
                  </select>
                </div>
              </div>
              <div className="form-table">
                {successMessage && (
                  <div className="success-msg">{successMessage}</div>
                )}
                <table>
                  <tbody>
                    <tr>
                      <td>Giờ vào</td>
                      <td>
                        <input
                          type="datetime-local"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Giờ ra</td>
                      <td>
                        <input
                          type="datetime-local"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Tăng ca</td>
                      <td>
                        <input
                          type="number"
                          value={overTime}
                          onChange={(e) => setOverTime(Number(e.target.value))}
                        />
                        <div className="sub-input">giờ</div>
                      </td>
                    </tr>
                    <tr>
                      <td>Đi muộn</td>
                      <td>
                        <input
                          type="number"
                          value={lateTime}
                          onChange={(e) => setLateTime(Number(e.target.value))}
                        />
                        <div className="sub-input">giờ</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="options">
                <div className="items off" onClick={handleNghihomnay}>
                  <div className="text">
                    {loading3 && <div className="loading-spinner"></div>}
                    Nghỉ
                  </div>
                </div>
                <div className="items active" onClick={handleUpdatedilam}>
                  <div className="text">
                    {loading2 && <div className="loading-spinner"></div>}
                    Lưu lại
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="fc off">
              <div className="title2">
                <div className="text">Nghỉ - {title}</div>
                <div className="dateType">
                  <select>
                    <option>Ngày thường</option>
                    <option>Ngày nghỉ</option>
                    <option>Ngày lễ</option>
                    <option>Ngày phép</option>
                  </select>
                </div>
              </div>
              <div className="form-table">
                <table>
                  <tbody>
                    <tr>
                      <td>Kiểu nghỉ</td>
                      <td>
                        <select
                          value={leaveType}
                          onChange={(e) => setLeaveType(Number(e.target.value))}
                        >
                          <option value={0}>Không phép</option>
                          <option value={1}>Có phép</option>
                          <option value={2}>Hưởng lương</option>
                          <option value={3}>Nghỉ ốm</option>
                        </select>
                      </td>
                    </tr>
                    {leaveType === 2 ? (
                      <tr>
                        <td>Hưởng lương</td>
                        <td>
                          <input
                            type="number"
                            value={salaryRatio}
                            onChange={(e) =>
                              setSalaryRatio(Number(e.target.value))
                            }
                          />
                          <div className="sub-input">%</div>
                        </td>
                      </tr>
                    ) : (
                      ""
                    )}
                  </tbody>
                </table>
              </div>
              <div className="options">
                <div className="items active" onClick={handleChamCongNgay}>
                  <div className="text">
                    {loading2 && <div className="loading-spinner"></div>}
                    Đi làm
                  </div>
                </div>
                <div className="items active" onClick={handleUpdatengay}>
                  <div className="text">
                    {loading3 && <div className="loading-spinner"></div>}
                    Lưu lại
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="fc">
            <div className="title2">{title}</div>
            <div className="message2">{message}</div>
            <div className="options">
              <div className="items off" onClick={handleNghihomnay}>
                <div className="text">
                  {loading3 && <div className="loading-spinner"></div>}
                  Nghỉ
                </div>
              </div>
              <div className="items active" onClick={handleChamCongNgay}>
                <div className="text">
                  {loading2 && <div className="loading-spinner"></div>}
                  Đi làm
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default BangcongChitiet;
