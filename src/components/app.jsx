import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import HomePage from "../app/index";
import Index from "../app/tools/index";
import Home from "../app/tools/home";
import Work from "../app/tools/work";
import Luong from "../app/tools/luong";
import { Provider } from "react-redux";
import { UserProvider } from "../app/context/userContext";

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
                  <Route path="/luong/:id" element={<Luong />} /> {/* Cập nhật đây */}
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
