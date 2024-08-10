import React, { useEffect } from "react";
import { authorize as zmpAuthorize } from "zmp-sdk/apis"; // Import đúng cách
import { Avatar, Box, Text } from "zmp-ui";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState, userInfoSelector } from "../state"; // Đảm bảo import đúng

const UserCard = () => {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const fetchedUserInfo = useRecoilValue(userInfoSelector);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await zmpAuthorize({ // Sử dụng hàm authorize đúng cách
          scopes: ["scope.userLocation", "scope.userPhonenumber"]
        });
        console.log("Authorization data:", data);
      } catch (error) {
        console.log("Authorization error:", error);
      }
    };

    fetchData();
  }, []); // Chạy hàm chỉ khi component được render

  console.log("User Info:", userInfo);

  return (
    <Box flex>
      <Avatar
        story="default"
        online
        src={userInfo.avatar.startsWith("http") ? userInfo.avatar : undefined}
      >
        {userInfo.avatar}
      </Avatar>
      <Box ml={4}>
        <Text.Title>{userInfo.name}</Text.Title>
        <Text>{userInfo.id}</Text>
      </Box>
    </Box>
  );
};

export default UserCard;
