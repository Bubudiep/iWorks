import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import adjustment from "../../../../img/adjustment.png";
import ic_scan from "../../../../img/scan.png";
import case_icon from "../../../../img/case.png";
import verified from "../../../../img/verified.png";
import ApiClient from "../../../../components/api";
import { useUser } from "../../../context/userContext";
import Popup from "./popup";

function toDate() {
  function pad(num, size) {
    return num.toString().padStart(size, "0");
  }
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${pad(month, 2)}-${pad(date, 2)}`;
}
const CreateWorkSheet = () => {
  const [loading, setLoading] = useState(false);
  const { userInfo, setUserInfo } = useUser();
  const [currentStep, setCurrentStep] = useState(
    userInfo.workSheet.Company ? 1 : 0
  );
  const fetchData = ApiClient();

  const [isFadeout, setIsFadeout] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState("error");
  const [popupTitle, setPopupTitle] = useState("Lỗi");
  const [popupMessage, setPopupMessage] = useState("");

  const [totalData, setTotalData] = useState({
    companyName: "Công ty A",
    positionName: null,
    workDays: 26,
    salarys: 4300000,
    phucap1: 300000,
    phucap2: 300000,
    phucap3: 0,
    workFinish: 15,
    startWorkdate: toDate(),
    chuyencan: 300000,
    ngaychuyencan: 26,
    calamviec: "HC",
    ngaynghi: "CN",
    luongtinhtangca: 0,
    luongkhongtinhtangca: 0,
  });
  const handlePreview = (step) => {
    handleNextStep(step);
  };
  const handleNextStep = (setstep = null) => {
    setCurrentStep((prevStep) => (setstep > 0 ? 3 : Math.min(prevStep + 1, 3)));
  };
  const handlePrevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };
  const handleSave = async () => {
    setLoading(true);
    try {
      const createWork = await fetchData.post(
        "/createworksheet",
        totalData,
        userInfo.login.token
      );
      showPopup(
        "ok",
        "Thành công",
        "Bảng lương đã được thêm! Thử chấm công và kiểm tra Lương tạm tính xem nào"
      );
      setTimeout(async () => {
        if (createWork) {
          setUserInfo((prevUser) => ({
            ...prevUser,
            workSheet: createWork,
          }));
        }
        // setIsPopupOpen(false);
      }, 1000);
    } catch (e) {
      console.log(e);
      showPopup("error", "Lỗi", "Phát sinh lỗi khi lưu, vui lòng thử lại!");
    } finally {
      setLoading(false);
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
    <>
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
            <div className="title">Bảng lương</div>
            <div className="messagex">
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
                  placeholder="tên công ty..."
                  onChange={(e) =>
                    setTotalData((pre) => ({
                      ...pre,
                      companyName: e.target.value,
                    }))
                  }
                  value={totalData.companyName}
                />
              </div>
              <div className="h-name">Lương cơ bản</div>
              <div className="h-input">
                <input
                  placeholder="lương cơ bản..."
                  onChange={(e) =>
                    setTotalData((pre) => ({ ...pre, salarys: e.target.value }))
                  }
                  value={totalData.salarys}
                />
                <div className="sub-input">VND</div>
              </div>
              <div className="h-name">Tổng phụ cấp</div>
              <div className="h-input">
                <input
                  placeholder="lương phụ cấp..."
                  onChange={(e) =>
                    setTotalData((pre) => ({ ...pre, phucap2: e.target.value }))
                  }
                  value={totalData.phucap2}
                />
                <div className="sub-input">VND</div>
              </div>
              <div className="h-name">Chuyên cần</div>
              <div className="h-input">
                <input
                  placeholder="lương chuyên cần..."
                  onChange={(e) =>
                    setTotalData((pre) => ({
                      ...pre,
                      chuyencan: e.target.value,
                    }))
                  }
                  value={totalData.chuyencan}
                />
                <div className="sub-input">VND</div>
              </div>
              <div className="h-name">Ngày bắt đầu đi làm</div>
              <div className="h-input">
                <input
                  type="date"
                  onChange={(e) =>
                    setTotalData((pre) => ({
                      ...pre,
                      startWorkdate: e.target.value,
                    }))
                  }
                  value={totalData.startWorkdate}
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
                  value={totalData.calamviec}
                  onChange={(e) =>
                    setTotalData((pre) => ({
                      ...pre,
                      calamviec: e.target.value,
                    }))
                  }
                >
                  <option value="HC">Hành chính</option>
                  <option value="2Ca">Ca ngày/đêm</option>
                </select>
              </div>
              <div className="h-name">Ngày nghỉ</div>
              <div className="h-input">
                <select
                  value={totalData.ngaynghi}
                  onChange={(e) =>
                    setTotalData((pre) => ({
                      ...pre,
                      ngaynghi: e.target.value,
                    }))
                  }
                >
                  <option value="CN">Chủ nhật (đi làm 200%)</option>
                  <option value="T7CN">T7 + CN (đi làm 200%)</option>
                </select>
              </div>
              <div className="h-name">Ngày chốt công</div>
              <div className="h-input">
                <input
                  placeholder="ngày chốt công..."
                  onChange={(e) =>
                    setTotalData((pre) => ({
                      ...pre,
                      workFinish: e.target.value,
                    }))
                  }
                  value={totalData.workFinish}
                />
                <div className="sub-input">Hàng tháng</div>
              </div>
              <div className="h-name">Ngày công trên tháng</div>
              <div className="h-input">
                <input
                  placeholder="số ngày công..."
                  onChange={(e) =>
                    setTotalData((pre) => ({
                      ...pre,
                      workDays: e.target.value,
                    }))
                  }
                  value={totalData.workDays}
                />
                <div className="sub-input">Ngày</div>
              </div>
              <div className="h-name">Lương khác (tính vào tăng ca)</div>
              <div className="h-input">
                <input
                  type="number"
                  placeholder="lương được tính tăng ca..."
                  onChange={(e) =>
                    setTotalData((pre) => ({
                      ...pre,
                      luongtinhtangca: e.target.value,
                    }))
                  }
                  value={totalData.luongtinhtangca}
                />
                <div className="sub-input">VND</div>
              </div>
              <div className="h-name">Lương khác (không tính vào tăng ca)</div>
              <div className="h-input">
                <input
                  type="number"
                  placeholder="lương không được tính tăng ca..."
                  onChange={(e) =>
                    setTotalData((pre) => ({
                      ...pre,
                      luongkhongtinhtangca: e.target.value,
                    }))
                  }
                  value={totalData.luongkhongtinhtangca}
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
                      {parseInt(totalData.salarys) +
                        (totalData.chuyencan && parseInt(totalData.chuyencan)) +
                        (totalData.phucap2 && parseInt(totalData.phucap2)) +
                        (totalData.luongkhongtinhtangca &&
                          parseInt(totalData.luongkhongtinhtangca)) +
                        (totalData.luongtinhtangca &&
                          parseInt(totalData.luongtinhtangca))}
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
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <FontAwesomeIcon icon={icon.faFloppyDisk} />
                )}
                Lưu
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateWorkSheet;
