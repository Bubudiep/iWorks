import React, { useState, useEffect } from "react";
import { getUserInfo, getSetting, authorize } from "zmp-sdk/apis";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import iw_logo from "../img/alert.png";
import { selector } from "recoil";
import { getUserInfo } from "zmp-sdk/apis";
import { useSelector } from "react-redux";

const Index = () => {
  const navigate = useNavigate();
  // const [userStateValue, setUserState] = useRecoilState(userState);
  // const [userInfo, setUserInfo] = useState(userStateValue.userInfo);
  const dispatch = useDispatch();
  const { user: userState } = useSelector((state) => state.user);
  useEffect(() => {
    if (userInfo.avatar && userInfo.name) {
      navigate("/home/");
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
                success: () => {
                  getUserInfo({
                    success: (data) => {
                      if (data.userInfo.avatar && data.userInfo.name) {
                        location.reload();
                      }
                    },
                    fail: (error) => {
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
  useEffect(() => {
    dispatch(
      userSlice.actions.getUser(
        selector({
          key: "user",
          get: () =>
            getUserInfo({
              avatarType: "normal",
            }),
        })
      )
    );
  }, []);
  return (
    <div className="full-page">
      <div className="top-bar"></div>
      <div className="body-main">
        <div className="logo">
          <img src={iw_logo} alt="Logo" />
        </div>
        <div className="message">
          Chào người mới! Trước tiên bạn cần đăng nhập bằng việc cấp quyền truy
          cập dữ liệu Zalo!
        </div>
        <div className="tools">
          <button
            type="button"
            className="accept"
            onClick={handleUserNameClick}
          >
            Cho phép
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
