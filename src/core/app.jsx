import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import HomePage from "./index";
import { UserProvider } from "./context/userContext";
import Index from "./page/index";
import Home from "./page/home";
import Work from "./page/work";
import Luong from "./page/luong";

const MyApp = () => {
  return (
    <RecoilRoot>
      <UserProvider>
        <App>
          <SnackbarProvider>
            <ZMPRouter>
              <Routes>
                <Route path="/" element={<HomePage />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/luong/:id" element={<Luong />} />{" "}
                  {/* Cập nhật đây */}
                  <Route path="/home" element={<Home />} />
                  <Route path="/work" element={<Work />} />
                </Route>
              </Routes>
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </UserProvider>
    </RecoilRoot>
  );
};

export default MyApp;
