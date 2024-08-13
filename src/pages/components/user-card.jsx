import React, { useState, useEffect } from "react";
import { Avatar, Box, Text } from "zmp-ui";
import { useRecoilValue, useSetRecoilState, atom, selector } from "recoil";
import { getUserInfo } from "zmp-sdk/apis";
import {
  getAccessToken,
  authorize,
  getLocation,
  getSetting,
} from "zmp-sdk/apis";

export const userState = selector({
  key: "user",
  get: () =>
    getUserInfo({
      avatarType: "normal",
    }),
});
const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 5) {
    return "Chúc ngủ ngon!";
  } else if (currentHour < 10) {
    return "Chào buổi sáng!";
  } else if (currentHour < 12) {
    return "Chuẩn bị ăn cơm thôi!";
  } else if (currentHour < 18) {
    return "Chào buổi chiều, nghỉ ngơi thôi!";
  } else {
    return "Chúc bạn buổi tối vui vẻ!";
  }
};
const UserCard = () => {
  const userStateValue = useRecoilValue(userState);
  const [userInfo, setUserInfo] = useState(userStateValue.userInfo);
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);

  useEffect(() => {
    if (userStateValue) {
      setUserInfo(userStateValue.userInfo);
    }
  }, [userStateValue]);

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
                      window.location.reload();
                    },
                    fail: (error) => {
                      // xử lý khi gọi api thất bại
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
    <div className="fc g5">
      <div className="user-header">
        <div className="avatar">
          <img
            src={
              userInfo.avatar.startsWith("http") ? userInfo.avatar : undefined
            }
          />
        </div>
        <div
          className="user-infor"
          onClick={handleUserNameClick} // Thêm sự kiện onClick vào đây
        >
          <div className="user-name">
            {userInfo.name == "" ? "Đăng nhập" : userInfo.name}
          </div>
          <div className="user-text">{getGreeting()}</div>
        </div>
      </div>
      <div className="user-level normal">
        <div className="items">Người mới</div>
      </div>
      {showPermissionRequest && (
        <div className="permission-request">
          <p>Vui lòng cấp quyền để tiếp tục.</p>
        </div>
      )}
    </div>
  );
};

export default UserCard;
