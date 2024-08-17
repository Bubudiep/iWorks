import React from 'react';
import { useParams } from 'react-router-dom';

const Luong = () => {
  const { id } = useParams(); // Lấy giá trị của tham số id
  return (
    <div>
      <h1>Luong Page</h1>
      <p>ID: {id}</p>
      {/* Hiển thị thông tin hoặc thực hiện logic khác dựa trên id */}
    </div>
  );
};
export default Luong;
