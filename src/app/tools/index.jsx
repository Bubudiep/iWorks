import React, { useState, useEffect } from "react";
import iw_logo from "../img/alert.png";
import { getUserInfo, getSetting, authorize } from "zmp-sdk/apis";
import { useNavigate } from "react-router-dom";
import logo from "../img/iwork_3.png";
import ApiClient from "../components/api";
import { useUser } from "../context/userContext";

const Index = () => {
  const { userInfo, setUserInfo } = useUser();
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();
  const fetch = ApiClient();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { userInfo } = await getUserInfo({});
        if (userInfo.id) {
          setUserInfo(userInfo);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.name) {
      setTimeout(async () => {
        const loginData = await fetch.post("/login", {
          zalo_id: userInfo.id,
          info: userInfo,
        });
        if (loginData) {
          userInfo.login = loginData;
          // Lấy thông tin về lương
          try {
            const response = await fetch.gets(
              "/worksheet_list_details",
              userInfo.login.token
            );
            setUserInfo((prevUser) => ({
              ...prevUser,
              workSheet: response.items[0],
            }));
          } catch (error) {
            console.log(error);
            setUserInfo((prevUser) => ({
              ...prevUser,
              workSheet: [],
            }));
          } finally {
            setTimeout(() => {
              navigate("/home/"); // về trang chủ
              setTimeout(() => {
                setLoading(false); // Tắt màn hình loading sau khi fade out hoàn tất
              }, 500); // Thời gian phù hợp với thời gian transition trong CSS
            }, 1000); // Đảm bảo loading hiển thị ít nhất 1 giây trước khi fade out
          }
        } else {
          console.error("Failed to login:", loginData);
        }
      }, 500); // Đảm bảo loading hiển thị ít nhất 1 giây trước khi fade out
    } else if (userInfo) {
      // Thời gian tối thiểu loading là 1 giây trước khi bắt đầu fade out
      setTimeout(() => {
        setFadeOut(true); // Kích hoạt hiệu ứng fade out
        setTimeout(() => {
          setLoading(false); // Tắt màn hình loading sau khi fade out hoàn tất
        }, 50); // Thời gian phù hợp với thời gian transition trong CSS
      }, 500); // Đảm bảo loading hiển thị ít nhất 1 giây trước khi fade out
    }
  }, [userInfo, navigate]);

  const handleUserNameClick = async () => {
    if (userInfo && userInfo.id) {
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
                  getUserInfo({
                    success: (data) => {
                      setFadeOut(false); // Kích hoạt hiệu ứng fade out
                      setLoading(true); // Tắt màn hình loading sau khi fade out hoàn tất
                      setUserInfo(data.userInfo);
                    },
                    fail: (error) => {
                      // xử lý khi gọi API thất bại
                      console.log(error);
                    },
                  });
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
    }
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
              onClick={handleUserNameClick} // Thêm sự kiện onClick vào đây
            >
              Cho phép
            </button>
          </div>
        </div>
        <div className="bot-bar" />
      </div>

      {/* Màn hình loading */}
      {loading && (
        <div className={`loading-screen ${fadeOut ? "fade-out" : ""}`}>
          <div className="body-main acenter">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
