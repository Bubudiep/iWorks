import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import ApiClient from "../components/api";

const Luong = () => {
  const { id } = useParams(); // Lấy giá trị của tham số id
  const { userInfo, setUserInfo } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState({});
  const fetchs = ApiClient();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(userInfo);
    if (userInfo?.login?.token) {
      setIsLoading(true);
      const fetchData = async () => {
        const data = [];
        try {
          const bangluong = await fetchs.gets(
            "/worksheet_list_details",
            userInfo.login.token
          );
          console.log(bangluong);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      navigate("/"); // về trang chủ
    }
  }, [userInfo]);
  return (
    <div className="chitietluong">
      <div className="thongkeluong">
        <div className="tencongty">Công ty A</div>
        <div className="chitiet">
          <div className="tieude">Chi tiết đi làm</div>
          <div className="thongke">
            <div className="items">
              <div className="name">Số ngày đi làm</div>
              <div className="value">0 ngày</div>
            </div>
            <div className="items">
              <div className="name">Giờ tăng ca</div>
              <div className="value">0 giờ</div>
            </div>
            <div className="items">
              <div className="name">Giờ tăng ca 200% (Chủ nhật)</div>
              <div className="value">0 giờ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Luong;
