import React, { useState, useEffect } from "react";
import iw_logo from "../img/alert.png";
import ApiClient from "./api";
import { useUser } from "../context/userContext";

const BangcongChitiet = (date) => {
  const { userInfo, setUserInfo } = useUser();
  const fetchs = ApiClient();
  checkDate(date);
  async function checkDate(date) {
    const response = await fetchs.gets(
      `/workrecord?workDate=${date}`,
      userInfo.login.token
    );
    console.log(response);
    if (response.items.length == 1) {
    }
  }
  return <div className="demo"></div>;
};

export default BangcongChitiet;
