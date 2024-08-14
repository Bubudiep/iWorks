import React, { useState, useEffect } from "react";
import iw_logo from "../img/alert.png";
import { getUserInfo,
  getAccessToken,
  authorize,
  getLocation,
  getSetting,
} from "zmp-sdk/apis";

const Index = () => {
  // Xử lý khi click vào nút cho phép
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { userInfo } = await getUserInfo({});
        if(userInfo.name&&userInfo.avatar){
          setUserInfo(userInfo); // Cập nhật trạng thái với thông tin người dùng
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      } finally {
        setTimeout(() => {
          setLoading(false); // Tắt trạng thái loading sau khi hoàn thành
        }, 1000); // 1000ms tương đương với 1 giây
      }
    };
    fetchUserInfo();
  }, []);
  // Nếu không có userInfo.name và userInfo.avatar, hiển thị trang đăng nhập
  if (loading) {
    return (
      <div className="full-page">
        <div className="body-main">
          <div className="message">
            Đang tải...
          </div>
        </div>
      </div>
    );
  }

  if (!userInfo?.name || !userInfo?.avatar) {
    return (
      <div className="full-page">
        <div className="top-bar"></div>
        <div className="body-main">
          <div className="logo">
            <img src={iw_logo} alt="Logo" />
          </div>
          <div className="message">
            Chào người mới! Trước tiên bạn cần đăng nhập bằng việc cấp quyền truy cập dữ liệu Zalo!
          </div>
          <div className="tools">
            <button type="button" className="accept">
              Cho phép
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Nếu đã có thông tin người dùng, hiển thị thông tin người dùng
  return (
    <div className="user-info">
      <h1>Xin chào, {userInfo.name}!</h1>
      <img src={userInfo.avatar} alt="User Avatar" />
      {/* Bạn có thể hiển thị thêm các thông tin khác nếu muốn */}
    </div>
  );
};

export default Index;
