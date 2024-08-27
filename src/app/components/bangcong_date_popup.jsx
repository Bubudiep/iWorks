import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import iw_logo from "../img/alert.png";
import ApiClient from "./api";
import { useUser } from "../context/userContext";

const BangcongChitiet = ({ date }) => {
  const { userInfo, setUserInfo } = useUser();
  const fetchs = ApiClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const [loading2, setLoading2] = useState(false); // State for loading
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  useEffect(() => {
    console.log(date);
    if (date) checkDate(date);
  }, [date]);

  const handleChamCongNgay = async () => {
    setLoading2(true); // Start loading
    console.log(date);
    try {
      const chamcong = await fetchs.post(
        "/cham-cong-ngay",
        {
          workDate: date,
        },
        userInfo.login.token
      );
      if (chamcong && chamcong?.result == "pass") {
        const response = await fetchs.gets(
          "/worksheet_list_details",
          userInfo.login.token
        );
        setUserInfo((prevUser) => ({ ...prevUser, workSheet: response }));
        setShowForm(true);
      } else {
        console.error("Failed to update user info");
      }
    } catch (error) {
      console.error("Error calling the API:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleNghihomnay = async () => {
    setLoading2(true); // Start loading
    console.log(date);
    try {
      const chamcong = await fetchs.post(
        "/nghi-viec-ngay",
        {
          workDate: date,
        },
        userInfo.login.token
      );
      if (chamcong && chamcong?.result == "pass") {
        const response = await fetchs.gets(
          "/worksheet_list_details",
          userInfo.login.token
        );
        setUserInfo((prevUser) => ({ ...prevUser, workSheet: response }));
        setShowForm(true);
      } else {
        console.error("Failed to update user info");
      }
    } catch (error) {
      console.error("Error calling the API:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  async function checkDate(date) {
    setShowPopup(true); // Show the popup
    setLoading(true); // Start loading
    try {
      const response = await fetchs.gets(
        `/workrecord?workDate=${date}`,
        userInfo.login.token
      );
      console.log(response);

      if (response.items.length === 1) {
        if (response.items[0].isWorking == true) {
          setIsWorking(true);
        } else {
          setIsWorking(false);
        }
        setShowForm(true);
        setTitle(`Ngày ${date}`);
        setMessage(""); // Clear any previous message
      } else {
        setShowForm(false);
        setTitle(`Ngày ${date}`);
        setMessage(`Bạn chưa chấm công!`);
      }
    } catch (error) {
      setShowForm(false);
      setMessage("Phát sinh lỗi khi kết nối dữ liệu!");
    } finally {
      setLoading(false); // End loading
    }
  }
  const handleUpdatengay = () => {};
  return (
    showPopup && (
      <>
        <div className="show-card mini">
          {loading ? (
            <div className="flex acenter message2">
              <div className="loading-spinner"></div>
            </div>
          ) : showForm ? (
            isWorking ? (
              <div className="fc">
                <div className="title2">Đi làm - {title}</div>
                <div className="form-table">
                  <table>
                    <tbody>
                      <tr>
                        <td>Giờ vào</td>
                        <td>
                          <input type="time" defaultValue={"08:00:00"} />
                        </td>
                      </tr>
                      <tr>
                        <td>Giờ ra</td>
                        <td>
                          <input type="time" defaultValue={"17:00:00"} />
                        </td>
                      </tr>
                      <tr>
                        <td>Tăng ca</td>
                        <td>
                          <input type="number" defaultValue={0} />
                          <div className="sub-input">giờ</div>
                        </td>
                      </tr>
                      <tr>
                        <td>Đi muộn</td>
                        <td>
                          <input type="number" defaultValue={0} />
                          <div className="sub-input">giờ</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="options">
                  <div className="items active" onClick={handleUpdatengay}>
                    <div className="text">Lưu lại</div>
                  </div>
                  <div className="items off" onClick={handleNghihomnay}>
                    <div className="text">Nghỉ</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="fc off">
                <div className="title2">Nghỉ - {title}</div>
                <div className="form-table">
                  <table>
                    <tbody>
                      <tr>
                        <td>Nghỉ</td>
                        <td>
                          <select>
                            <option value={1}>Có phép</option>
                            <option value={0}>Không phép</option>
                            <option value={2}>Hưởng lương</option>
                            <option value={3}>Có bảo hiểm</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>Hưởng lương</td>
                        <td>
                          <input type="number" defaultValue={100} />
                          <div className="sub-input">%</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="options">
                  <div className="items active" onClick={handleUpdatengay}>
                    <div className="text">Lưu lại</div>
                  </div>
                  <div className="items active" onClick={handleChamCongNgay}>
                    <div className="text">Đi làm</div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="fc">
              <div className="title2">{title}</div>
              <div className="message2">{message}</div>
              <div className="options">
                <div className="items active" onClick={handleChamCongNgay}>
                  <div className="text">Đi làm</div>
                </div>
                <div className="items" onClick={handleNghihomnay}>
                  <div className="text">Nghỉ</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    )
  );
};

export default BangcongChitiet;
