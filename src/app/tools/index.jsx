import React, { useState, useEffect } from "react";
import iw_logo from "../img/alert.png";
import { getUserInfo, getSetting, authorize } from "zmp-sdk/apis";
import { useNavigate } from "react-router-dom";
import logo from "../img/iwork_3.png";

const Index = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { userInfo } = await getUserInfo({});
        if (userInfo.id) {
          setUserInfo(userInfo);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      } finally {
        // Thời gian tối thiểu loading là 1 giây trước khi bắt đầu fade out
        setTimeout(() => {
          setFadeOut(true); // Kích hoạt hiệu ứng fade out
          setTimeout(() => {
            setLoading(false); // Tắt màn hình loading sau khi fade out hoàn tất
          }, 700); // Thời gian phù hợp với thời gian transition trong CSS
        }, 1300); // Đảm bảo loading hiển thị ít nhất 1 giây trước khi fade out
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo?.name) {
      setTimeout(() => {
        navigate("/home/", { state: { userInfo } }); // Truyền userInfo vào state khi điều hướng
        setTimeout(() => {
          setLoading(false); // Tắt màn hình loading sau khi fade out hoàn tất
        }, 700); // Thời gian phù hợp với thời gian transition trong CSS
      }, 1300); // Đảm bảo loading hiển thị ít nhất 1 giây trước khi fade out
    }
  }, [userInfo, navigate]);

  const handleUserNameClick = async () => {
    console.log("handleUserNameClicking", userInfo);
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
