import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import HomePage from "../pages";
import Home from "../pages/tools/home";
import Work from "../pages/tools/work";
import Index from "../pages/tools/index";

const MyApp = () => {
  return (
    <RecoilRoot>
      <App>
        <SnackbarProvider>
          <ZMPRouter>
            <Routes>
              <Route path="/" element={<HomePage />}>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<Home />} />
                <Route path="/work" element={<Work />} />
              </Route>
            </Routes>
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};
export default MyApp;
