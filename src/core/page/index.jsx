import React, { useState, useEffect } from "react";
import { getUserInfo, getSetting, authorize } from "zmp-sdk/apis";
import { useNavigate } from "react-router-dom";
import logo from "../../img/logo.png";
import ApiClient from "../../components/api";
import { useUser } from "../context/userContext";
import link from "../../img/link.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";

const Index = () => {
  const { userInfo, setUserInfo } = useUser();
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [retryCount, setRetryCount] = useState(0); // Số lần retry
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi
  const navigate = useNavigate();
  const fetch = ApiClient();
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchUserInfo = async (retry = 3) => {
    try {
      const { userInfo } = await getUserInfo({});
      if (userInfo.id && userInfo.name) {
        setUserInfo(userInfo);
        const loginData = await fetch.post("/login", {
          zalo_id: userInfo.id,
          info: userInfo,
        });
        if (loginData) {
          userInfo.login = loginData;
          try {
            const response = await fetch.gets(
              "/worksheet_list_details",
              userInfo.login.token
            );
            const reCord = await fetch.gets(
              "/workrecord?per_page=999&month=" +
                (currentDate.getMonth() + 1) +
                "&year=" +
                currentDate.getFullYear(),
              userInfo.login.token
            );
            setUserInfo((prevUser) => ({
              ...prevUser,
              month: currentDate.getMonth() + 1,
              workSheet: response.items[0],
              reCord: reCord.items,
            }));
          } catch (error) {
            console.log(error);
            setUserInfo((prevUser) => ({
              ...prevUser,
              workSheet: [],
            }));
          } finally {
            setTimeout(() => {
              setTimeout(() => {
                navigate("/home/");
                setLoading(false);
              }, 500);
            }, 1000);
          }
        } else {
          console.error("Failed to login:", loginData);
        }
      } else {
        // Thời gian tối thiểu loading là 1 giây trước khi bắt đầu fade out
        setTimeout(() => {
          setFadeOut(true); // Kích hoạt hiệu ứng fade out
          setTimeout(() => {
            setLoading(false); // Tắt màn hình loading sau khi fade out hoàn tất
          }, 50); // Thời gian phù hợp với thời gian transition trong CSS
        }, 500); // Đảm bảo loading hiển thị ít nhất 1 giây trước khi fade out
      }
    } catch (error) {
      if (retry > 0) {
        setTimeout(() => {
          fetchUserInfo(retry - 1);
          setRetryCount((prevRetryCount) => prevRetryCount + 1);
        }, 2000);
      } else {
        setErrorMessage("Máy chủ đang bảo trì!");
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleUserNameClick = async () => {
    getSetting({
      success: (data) => {
        if (Object.keys(data.authSetting).length > 0) {
          if (
            data.authSetting["scope.userInfo"] &&
            data.authSetting["scope.userInfo"] === true
          ) {
            console.log(userInfo);
          } else {
            authorize({
              scopes: ["scope.userInfo", "scope.userPhonenumber"],
              success: (data) => {
                setFadeOut(false);
                setLoading(true);
                fetchUserInfo();
              },
              fail: (error) => {
                console.log(error);
              },
            });
          }
        }
      },
      fail: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <div className="full-page-container">
      <div className="full-page normal">
        <div className="top-bar" />
        <div className="body-main">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <div className="message">
            <ul>
              <li>
                <b>iWork</b> là Ứng dụng được phát triển bởi <b>Hi Tech</b>,
                cung cấp những tính năng phục vụ người dùng trong việc ghi lại
                và tính toán giờ giấc chấm công và lương trong quá trình làm
                việc.
              </li>
              <li>
                Để đảm bảo dữ liệu được lưu lại và bảo mật thông tin không bị rò
                rỉ, bạn cần <b>đăng nhập</b> để xác nhận phiên truy cập!
              </li>
              <li>
                Cấp quyền truy cập dữ liệu <b>Zalo</b> sẽ cho là bước đăng nhập
                dữ liệu người dùng!
              </li>
            </ul>
          </div>
          <div className="tools">
            <button
              type="button"
              className="accept"
              onClick={handleUserNameClick}
            >
              <FontAwesomeIcon icon={icon.faIdCard} />
              Cho phép
            </button>
          </div>
        </div>
        <div className="bot-bar" />
      </div>

      {loading && (
        <div className={`loading-screen ${fadeOut ? "fade-out" : ""}`}>
          <div className="body-main acenter">
            {errorMessage ? (
              <>
                <div className="error-image">
                  <img src={link} alt="Error" />
                </div>
              </>
            ) : (
              <div className="my-loader">
                <div className="jelly-triangle">
                  <div className="jelly-triangle__dot"></div>
                  <div className="jelly-triangle__traveler"></div>
                </div>
                <svg width="0" height="0" className="jelly-maker">
                  <defs>
                    <filter id="uib-jelly-triangle-ooze">
                      <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation="7.3"
                        result="blur"
                      ></feGaussianBlur>
                      <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                        result="ooze"
                      ></feColorMatrix>
                      <feBlend in="SourceGraphic" in2="ooze"></feBlend>
                    </filter>
                  </defs>
                </svg>
              </div>
            )}
            <div className="retry">
              {retryCount > 0 &&
                (errorMessage ? (
                  <div className="error-message">{errorMessage}</div>
                ) : (
                  <div className="retry-message">
                    Đang kết nối ({retryCount})
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
