import { Suspense, React, useEffect, useState } from "react";
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
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const homeBody = document.querySelector('.home-body');
      const topContainer = homeBody?.querySelector('.top-container');

      if (homeBody && topContainer) {
        const currentScrollPos = homeBody.scrollTop;
        const isScrollingDown = currentScrollPos > prevScrollPos;

        // Calculate new height based on scroll position
        const newHeight = Math.max(120, 250 - currentScrollPos);

        // Apply the new height to topContainer
        topContainer.style.height = `${newHeight}px`;

        // Check scroll direction
        if (isScrollingDown) {
          console.log('Scrolling down');
          // Perform actions when scrolling down
        } else {
          console.log('Scrolling up');
          // Perform actions when scrolling up
        }

        // Update previous scroll position
        setPrevScrollPos(currentScrollPos);
      }
    };

    const homeBody = document.querySelector('.home-body');
    if (homeBody) {
      homeBody.addEventListener('scroll', handleScroll);
    }

    // Cleanup event listener on component unmount
    return () => {
      if (homeBody) {
        homeBody.removeEventListener('scroll', handleScroll);
      }
    };
  }, [prevScrollPos]);

  return (
    <Suspense>
      <div className="body-container">
        <div className="top-container" style={sectionStyle}>
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
          <div className="h3 top10">Bảng công</div>
          <div className="h-items pd0x10">
            <BangCong />
          </div>
          <div className="h3 top10">Tiện ích</div>
          <div className="h-items pd0x10">
            <div className="extension-list">
              <div className="items">
                <div className="logo"></div>
                <div className="name">Bảng lương</div>
              </div>
              {/* Add more items here */}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Home;
