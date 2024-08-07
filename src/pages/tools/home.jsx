import React from "react";
import Background from '../img/iw_bg_2.png';
var sectionStyle = {
  backgroundImage: `url(${Background})`
};
const Home = () => {
  return (
    <div className="home-container">
      <div className="top-container active" style={sectionStyle}></div>
    </div>
  );
};
export default Home;