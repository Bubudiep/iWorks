import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";

const UpdateTodayWork = () => {
  return (
    <div className="pd0x10">
      <div className="message-container">
        <div className="message">
          <div className="name">Bạn có tăng ca hay vào muộn gì không?</div>
          <table>
            <tbody>
              <tr>
                <td>Tăng ca</td>
                <td>
                  <input type="number" placeholder="0" /> tiếng
                </td>
              </tr>
              <tr>
                <td>Vào muộn</td>
                <td>
                  <input type="number" placeholder="0" /> tiếng
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="options">
          <div className="items active">
            <div className="logo">
              <FontAwesomeIcon icon={icon.faCheck} />
            </div>
            <div className="text">Xong!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTodayWork;
