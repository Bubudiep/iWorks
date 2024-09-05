import React, { useState, useEffect } from "react";

const ChitietCong = () => {
  return (
    <div className="chitietCong">
      <div className="header">
        <div className="name">Chi tiết bảng công</div>
      </div>
      <div className="body">
        <div className="hr1">Ngày công</div>
        <div className="details_box">
          <table>
            <tbody>
              <tr><td>Ngày thường</td><td>0 ngày</td></tr>
              <tr><td>Cắt nghỉ</td><td>0 ngày</td></tr>
              <tr><td>Chủ đặc biệt</td><td>0 ngày</td></tr>
              <tr><td>Chủ nhật</td><td>0 ngày</td></tr>
              <tr><td>Ngày Lễ</td><td>0 ngày</td></tr>
              <tr><td>Nghỉ không phép</td><td>0 ngày</td></tr>
              <tr><td>Nghỉ không lương</td><td>0 ngày</td></tr>
            </tbody>
          </table>
        </div>
        <div className="hr1">Tính theo giờ</div>
        <div className="details_box">
          <table>
            <tbody>
              <tr><td>Giờ thường</td><td>0 giờ</td></tr>
              <tr><td>Giờ ca đêm</td><td>0 giờ</td></tr>
              <tr><td>Giờ tăng ca</td><td>0 giờ</td></tr>
              <tr><td>Giờ bình thường</td><td>0 giờ</td></tr>
              <tr><td><b>Tổng giờ quy đổi</b></td><td>0 giờ</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChitietCong;
