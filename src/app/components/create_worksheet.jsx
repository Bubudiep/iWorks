import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import case_icon from "../img/case.png";
import adjustment from "../img/adjustment.png";
import verified from "../img/verified.png";
import ic_scan from "../img/scan_6064668.png";
import email_4852081 from "../img/email_4852081.png";
import Popup from "./popup"; // Import component popup
import { useUser } from "../context/userContext";
import ApiClient from "./api";

function toDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${pad(month, 2)}-${pad(date, 2)}`;
}

function pad(num, size) {
  return num.toString().padStart(size, "0");
}

const CreateWorkSheet = () => {
  const { userInfo, setUserInfo } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [totalData, setTotalData] = useState({});
  const [isFadeout, setIsFadeout] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState("error");
  const [popupTitle, setPopupTitle] = useState("Lỗi");
  const [popupMessage, setPopupMessage] = useState("");

  const refs = {
    companyName: useRef(null),
    positionName: useRef(null),
    workDays: useRef(0),
    salarys: useRef(0),
    phucap1: useRef(0),
    phucap2: useRef(0),
    phucap3: useRef(0),
    workFinish: useRef(1),
    startWorkdate: useRef(null),
    chuyencan: useRef(300000),
    ngaychuyencan: useRef(26),
    calamviec: useRef("HC"),
    ngaynghi: useRef("CN"),
    luongtinhtangca: useRef(0),
    luongkhongtinhtangca: useRef(0),
  };

  const fetchData = ApiClient();
  const handleNextStep = (setstep = null) => {
    setTotalData({
      ...totalData,
      companyName: refs.companyName.current?.value || totalData.companyName,
      positionName: refs.positionName.current?.value || totalData.positionName,
      startWorkdate:
        refs.startWorkdate.current?.value || totalData.startWorkdate,
      workFinish: refs.workFinish.current?.value || totalData.workFinish,
      workDays: refs.workDays.current?.value || totalData.workDays,
      salarys: parseInt(refs.salarys.current?.value) || totalData.salarys,
      chuyencan: refs.chuyencan.current?.value || totalData.chuyencan,
      ngaychuyencan:
        refs.ngaychuyencan.current?.value || totalData.ngaychuyencan,
      phucap1: parseInt(refs.phucap1.current?.value) || totalData.phucap1 || 0,
      phucap2: parseInt(refs.phucap2.current?.value) || totalData.phucap2 || 0,
      phucap3: parseInt(refs.phucap3.current?.value)|| totalData.phucap3 || 0,
      calamviec: refs.calamviec.current?.value || totalData.calamviec,
      ngaynghi: refs.ngaynghi.current?.value || totalData.ngaynghi,
      luongtinhtangca: refs.luongtinhtangca.current?.value || totalData.luongtinhtangca || 0,
      luongkhongtinhtangca: refs.luongkhongtinhtangca.current?.value || totalData.luongkhongtinhtangca || 0,
    });
    setCurrentStep((prevStep) => (setstep > 0 ? 3 : Math.min(prevStep + 1, 3)));
  };

  const handlePreview = (step) => {
    handleNextStep(step);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleSave = async () => {
    console.log("Dữ liệu được lưu lại:", totalData);
    try {
      const createWork = await fetchData.post(
        "/createworksheet",
        totalData,
        userInfo.login.token
      );
      showPopup("ok", "Thành công", "Bảng lương đã được thêm!");
      setTimeout(async () => {
        if (createWork) {
          const response = await fetchData.gets(
            "/worksheet_list_details",
            userInfo.login.token
          );
          setUserInfo((prevUser) => ({ ...prevUser, workSheet: response }));
        }
        setIsPopupOpen(false);
      }, 1000);
    } catch (e) {
      console.log(e);
      showPopup("error", "Lỗi", "Phát sinh lỗi khi lưu, vui lòng thử lại!");
    }
  };

  const showPopup = (type, title, message) => {
    setPopupType(type);
    setPopupTitle(title);
    setPopupMessage(message);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="bg-page">
      <Popup
        title={popupTitle}
        message={popupMessage}
        isOpen={isPopupOpen}
        onClose={closePopup}
        type={popupType}
        fadeOut={isFadeout}
      />
      <div className="show-card">
        {currentStep === 0 && (
          <div className="step-box">
            <div className="logo">
              <img src={adjustment} alt="case icon" />
            </div>
            <div className="title">Chào thành viên mới</div>
            <div className="message">
              <ul>
                <li>
                  Hiện tại bạn chưa làm việc tại công ty và chưa có bảng lương
                  nào, bạn cần thêm công ty và bảng lương để quản lý!
                </li>
                <li>
                  Chọn <b>Quét mã</b> để nhập cài đặt bảng lương từ người khác!
                </li>
                <li>
                  Hoặc <b>Tự thiết lập</b> để bắt đầu các bước cài đặt!
                </li>
              </ul>
            </div>
            <div className="step-buttons">
              <button className="scanQR" onClick={handlePrevStep}>
                <img src={ic_scan} />
                Quét mã
              </button>
              <button className="next" onClick={() => handleNextStep()}>
                <FontAwesomeIcon icon={icon.faGears} /> Tự thiết lập
              </button>
            </div>
          </div>
        )}
        {currentStep === 1 && (
          <div className="step-box">
            <div className="logo">
              <img src={case_icon} alt="case icon" />
            </div>
            <div className="title">Công ty và lương cơ bản</div>
            <div className="form-group">
              <div className="h-name">Tên công ty</div>
              <div className="h-input">
                <input
                  ref={refs.companyName}
                  placeholder="tên công ty..."
                  defaultValue={totalData.companyName || "Compal"}
                />
              </div>
              <div className="h-name">Lương cơ bản</div>
              <div className="h-input">
                <input
                  ref={refs.salarys}
                  placeholder="lương cơ bản..."
                  defaultValue={totalData.salarys || 4300000}
                />
                <div className="sub-input">VND</div>
              </div>
              <div className="h-name">Tổng phụ cấp</div>
              <div className="h-input">
                <input
                  ref={refs.phucap2}
                  placeholder="lương phụ cấp..."
                  defaultValue={totalData.phucap2 || 300000}
                />
                <div className="sub-input">VND</div>
              </div>
              <div className="h-name">Chuyên cần</div>
              <div className="h-input">
                <input
                  ref={refs.chuyencan}
                  placeholder="lương chuyên cần..."
                  defaultValue={totalData.chuyencan || 300000}
                />
                <div className="sub-input">VND</div>
              </div>
              <div className="h-name">Ngày bắt đầu đi làm</div>
              <div className="h-input">
                <input
                  ref={refs.startWorkdate}
                  type="date"
                  defaultValue={totalData.startWorkdate || toDate()}
                />
              </div>
            </div>
            <div className="step-buttons">
              <div className="left">
                <button className="save" onClick={() => handlePreview(3)}>
                  <FontAwesomeIcon icon={icon.faFloppyDisk} /> Lưu
                </button>
              </div>
              <div className="right">
                <button className="prev" onClick={handlePrevStep}>
                  Quay lại
                </button>
                <button className="next" onClick={() => handleNextStep()}>
                  Nâng cao
                </button>
              </div>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="step-box">
            <div className="logo">
              <img src={case_icon} alt="case icon" />
            </div>
            <div className="title">Nâng cao</div>
            <div className="form-group">
              <div className="h-name">Ca làm việc</div>
              <div className="h-input">
                <select
                  ref={refs.calamviec}
                  >
                  <option value="HC">Hành chính</option>
                  <option value="2Ca">Ca ngày/đêm</option>
                  <option value="3Ca">3 ca</option>
                </select>
              </div>
              <div className="h-name">Ngày nghỉ</div>
              <div className="h-input">
                <select
                  ref={refs.ngaynghi}>
                  <option value="CN">Chủ nhật (đi làm 200%)</option>
                  <option value="T7CN">T7 + CN (đi làm 200%)</option>
                </select>
              </div>
              <div className="h-name">Ngày chốt công</div>
              <div className="h-input">
                <input
                  ref={refs.workFinish}
                  placeholder="ngày chốt công..."
                  defaultValue={totalData.workFinish || 15}
                />
                <div className="sub-input">Hàng tháng</div>
              </div>
              <div className="h-name">Ngày công trên tháng</div>
              <div className="h-input">
                <input
                  ref={refs.workDays}
                  placeholder="số ngày công..."
                  defaultValue={totalData.workDays || 26}
                />
                <div className="sub-input">Ngày</div>
              </div>
              <div className="h-name">Lương khác (tính vào tăng ca)</div>
              <div className="h-input">
                <input
                  type="number"
                  ref={refs.luongtinhtangca}
                  placeholder="lương được tính tăng ca..."
                  defaultValue={totalData.luongtinhtangca || 0}
                />
                <div className="sub-input">VND</div>
              </div>
              <div className="h-name">Lương khác (không tính vào tăng ca)</div>
              <div className="h-input">
                <input
                  type="number"
                  ref={refs.luongkhongtinhtangca}
                  placeholder="lương không được tính tăng ca..."
                  defaultValue={totalData.luongkhongtinhtangca || 0}
                />
                <div className="sub-input">VND</div>
              </div>
            </div>
            <div className="step-buttons">
              <div className="left">
                <button className="save" onClick={handleSave}>
                  <FontAwesomeIcon icon={icon.faFloppyDisk} /> Lưu
                </button>
              </div>
              <div className="right">
                <button className="prev" onClick={handlePrevStep}>
                  Quay lại
                </button>
                <button className="next" onClick={() => handleNextStep(3)}>
                  Hoàn thành
                </button>
              </div>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="step-box">
            <div className="logo">
              <img src={verified} alt="verified icon" />
            </div>
            <div className="message">
              Kiểm tra lại thông tin và xác nhận tạo!
            </div>
            <div className="summary">
              <table>
                <tbody>
                  <tr>
                    <td>Tên công ty</td>
                    <td>{totalData.companyName}</td>
                  </tr>
                  <tr>
                    <td>Lương cơ bản</td>
                    <td>{totalData.salarys}</td>
                  </tr>
                  {totalData.chuyencan ? (
                    <tr>
                      <td>Chuyên cần</td>
                      <td>{totalData.chuyencan}</td>
                    </tr>
                  ) : null}
                  {totalData.phucap2 ? (
                    <tr>
                      <td>Phụ cấp</td>
                      <td>{totalData.phucap2}</td>
                    </tr>
                  ) : null}
                  {totalData.luongtinhtangca ? (
                    <tr>
                      <td>Lương khác (tính tăng ca)</td>
                      <td>{totalData.luongtinhtangca}</td>
                    </tr>
                  ) : null}
                  {totalData.luongkhongtinhtangca ? (
                    <tr>
                      <td>Lương khác (0 tính tăng ca)</td>
                      <td>{totalData.luongkhongtinhtangca}</td>
                    </tr>
                  ) : null}
                  {totalData.workFinish ? (
                    <tr>
                      <td>Ngày chốt công</td>
                      <td>{totalData.workFinish}</td>
                    </tr>
                  ) : null}
                  {totalData.workDays ? (
                    <tr>
                      <td>Ngày công</td>
                      <td>{totalData.workDays}</td>
                    </tr>
                  ) : null}
                  <tr>
                    <td>Tổng lương</td>
                    <td>
                      {
                        (parseInt(totalData.salarys))
                        + (totalData.chuyencan&&parseInt(totalData.chuyencan))
                        + (totalData.phucap2&&parseInt(totalData.phucap2))
                        + (totalData.luongkhongtinhtangca&&parseInt(totalData.luongkhongtinhtangca))
                        + (totalData.luongtinhtangca&&parseInt(totalData.luongtinhtangca))
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="step-buttons">
              <button className="prev" onClick={handlePrevStep}>
                Quay lại
              </button>
              <button className="save" onClick={handleSave}>
                <FontAwesomeIcon icon={icon.faFloppyDisk} /> Lưu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateWorkSheet;
