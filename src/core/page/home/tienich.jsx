import React, { useState, useEffect } from "react";

const TienIch = () => {
  return (
    <div className="extension-list">
      {Array.from({ length: 12 }).map((_, index) => (
        <div className="items" key={index}>
          <div className="logo"></div>
          <div className="name">Bảng lương</div>
        </div>
      ))}
    </div>
  );
};

export default TienIch;
