// UserCard.js
import React from "react";
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
const UserCard = ({ userInfo }) => {
  return (
    <div className="user-card">
      {userInfo ? (
        <>
          <div className="fc g5">
            <div className="user-header">
              <div className="avatar">
                <img
                  src={
                    userInfo.avatar.startsWith("http")
                      ? userInfo.avatar
                      : undefined
                  }
                />
              </div>
              <div className="user-infor">
                <div className="user-name">
                  {userInfo.name == "" ? "Đăng nhập" : userInfo.name}
                </div>
                <div className="user-text">{getGreeting()}</div>
              </div>
            </div>
            <div className="user-level normal">
              <div className="items">Người mới</div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserCard;
