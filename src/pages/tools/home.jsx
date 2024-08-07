import { Suspense, React } from "react";
import Background from "../img/iw_bg_2.png";
import Iwork_logo from "../img/logo_txt.png";
import MoneyCard from "../components/money-cart";
import UserCard from "../components/user-card";
import AppCard from "../components/app-card";
import BangCong from "../components/bangcong";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";

var sectionStyle = {
  backgroundImage: `url(${Background})`,
};
const Home = () => {
  return (
    <Suspense>
      <div className="body-container">
        <div className="top-container active" style={sectionStyle}>
          <div className="app-container">
            <AppCard />
          </div>
          <div className="user-container">
            <UserCard />
            <div className="logo">
              <img src={Iwork_logo} />
            </div>
          </div>
          <div className="fast-option">
            <MoneyCard />
          </div>
        </div>
        <div className="body-main">
          <div className="pd0x10">
            <div className="message-container">
              <div className="message">Hôm nay bạn có đi làm không?</div>
              <div className="options">
                <div className="items active">
                  <div className="logo">
                    <FontAwesomeIcon icon={icon.faCalendarCheck} />
                  </div>
                  <div className="text">Chấm công ngay!</div>
                </div>
                <div className="items">
                  <div className="logo">
                    <FontAwesomeIcon icon={icon.faCalendar} />
                  </div>
                  <div className="text">Hôm nay nghỉ!</div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="h3">Hôm nay bạn có đi làm không?</div>
          <div className="h-items">
            <div className="fast-check">
              <div className="work-option">
                <div className="work-check">
                  <div className="logo">
                    <FontAwesomeIcon icon={icon.faCalendarCheck} />
                  </div>
                  <div className="text">Chấm công ngay!</div>
                </div>
                <div className="work-pass">Hôm nay nghỉ</div>
              </div>
            </div>
          </div> */}
          <div className="h3 top10">Bảng công</div>
          <div className="h-items pd0x10">
            <BangCong />
          </div>
          <div className="h3 top10">Tiện ích</div>
          <div className="h-items pd0x10"></div>
        </div>
      </div>
    </Suspense>
  );
};
export default Home;
