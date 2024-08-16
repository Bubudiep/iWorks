import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import HomePage from "../app/index";
import Index from "../app/tools/index";
import Home from "../app/tools/home";
import Work from "../app/tools/work";
import { Provider } from "react-redux";
import store from "../appa/store";
import { UserProvider } from "../app/context/userContext";

const MyApp = () => {
  return (
    <Provider store={store}>
      <RecoilRoot>
        <UserProvider>
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
        </UserProvider>
      </RecoilRoot>
    </Provider>
  );
};
export default MyApp;
