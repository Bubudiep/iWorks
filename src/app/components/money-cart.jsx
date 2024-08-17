import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import ApiClient from "./api";
import case_icon from "../img/case.png";
import adjustment from "../img/adjustment.png";
import verified from "../img/verified.png";
import ic_scan from "../img/scan_6064668.png";
import email_4852081 from "../img/email_4852081.png";
import Popup from "./popup"; // Import component popup
import { useUser } from "../context/userContext";

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
function toDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  console.log(`${year}-${month}-${date}`);
  return `${year}-${pad(month, 2)}-${pad(date, 2)}`;
}

const MoneyCard = () => {
  const { userInfo, setUserInfo } = useUser();
  const [currentStep, setCurrentStep] = useState(0); // Quản lý các bước thiết lập
  const [workSheet, setWorkSheet] = useState([]); // Sử dụng mảng để lưu các item từ API
  const [isLoading, setIsLoading] = useState(true);
  const [isViewed, setIsViewed] = useState(false); // Kiểm soát trạng thái hiển thị số tiền

  const [totalData, setTotalData] = useState({}); // Biến tổng hợp dữ liệu từ các bước

  const companyName = useRef(null);
  const positionName = useRef(null);
  const workDays = useRef(0);
  const salarys = useRef(0);
  const phucap1 = useRef(0);
  const phucap2 = useRef(0);
  const workFinish = useRef(1);
  const startWorkdate = useRef(null);
  const chuyencan = useRef(300000);
  const ngaychuyencan = useRef(26);

  const [isFadeout, setIsFadeout] = useState(false); // Popup statepopup
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup statepopup
  const [popupType, setpopupType] = useState("error"); // Popup message
  const [popupTitle, setpopupTitle] = useState("Lỗi"); // Popup message
  const [popupMessage, setPopupMessage] = useState(""); // Popup message

  const fetchData = ApiClient();
  useEffect(() => {
    const getWorksheet = async () => {
      try {
        const response = await fetchData.gets(
          "/worksheet_list_details",
          userInfo.login.token
        );
        console.log(response);
        if (response && response.items.length === 0) {
          setWorkSheet([]);
        } else {
          setWorkSheet(response.items);
        }
      } catch (error) {
        setWorkSheet([]);
      } finally {
        setIsLoading(false);
      }
    };
    getWorksheet();
  }, [userInfo]);
  const handleViewToggle = () => {
    setIsViewed((prev) => !prev);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleNextStep = (setstep=null) => {
    if (currentStep == 1) {
      if (
        companyName.current?.value == null ||
        companyName.current?.value == ""
      ) {
        setpopupType("error");
        setpopupTitle("Lỗi");
        setPopupMessage("Bạn chưa nhập tên công ty!");
        setIsPopupOpen(true);
        return;
      }
      if (
        salarys.current?.value == null ||
        salarys.current?.value == ""
      ) {
        setpopupType("error");
        setpopupTitle("Lỗi");
        setPopupMessage("Bạn chưa nhập tên công ty!");
        setIsPopupOpen(true);
        return;
      }
    } else if (currentStep == 2) {
      if (workDays.current?.value == null || workDays.current?.value <= 0) {
        setpopupType("error");
        setpopupTitle("Lỗi");
        setPopupMessage("Bạn chưa nhập số ngày làm việc!");
        setIsPopupOpen(true);
        return;
      }
      if (phucap1.current?.value == null || phucap1.current?.value < 0) {
        setpopupType("error");
        setpopupTitle("Lỗi");
        setPopupMessage("Bạn chưa nhập phụ cấp cố định!");
        setIsPopupOpen(true);
        return;
      }
      if (phucap2.current?.value == null || phucap2.current?.value < 0) {
        setpopupType("error");
        setpopupTitle("Lỗi");
        setPopupMessage("Bạn chưa nhập phụ cấp tính theo ngày!");
        setIsPopupOpen(true);
        return;
      }
    }
    setTotalData({
      companyName: companyName.current?.value
        ? companyName.current.value
        : totalData.companyName,
      positionName: positionName.current?.value
        ? positionName.current.value
        : totalData.positionName,
      startWorkdate: startWorkdate.current?.value
        ? startWorkdate.current.value
        : totalData.startWorkdate,
      workFinish: workFinish.current?.value
        ? workFinish.current.value
        : totalData.workFinish,
      workDays: workDays.current?.value
        ? workDays.current.value
        : totalData.workDays,
      salarys: salarys.current?.value
        ? salarys.current.value
        : totalData.salarys,
      chuyencan: chuyencan.current?.value
        ? chuyencan.current.value
        : totalData.chuyencan,
      ngaychuyencan: ngaychuyencan.current?.value
        ? ngaychuyencan.current.value
        : totalData.ngaychuyencan,
      phucap1: phucap1.current?.value
        ? phucap1.current.value
        : totalData.phucap1,
      phucap2: phucap2.current?.value
        ? phucap2.current.value
        : totalData.phucap2,
    });
    if (currentStep < 3) {
      if (setstep>0){
        setCurrentStep(3);
      } else {
        setCurrentStep((prevStep) => prevStep + 1);
      }
    }
  };
  
  const handlePreview = (step) => {
    handleNextStep(step)
  };
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handleSave = async () => {
    console.log("Dữ liệu được lưu lại:", totalData);
    try{
      const createWork = await fetchData.post(
        "/createworksheet",
        totalData,
        userInfo.login.token
      );
      setUserInfo(prevUser => ({
        ...prevUser,
        workSheet: createWork
      }));
      setpopupType("ok");
      setpopupTitle("Thành công");
      setPopupMessage("Bảng lương đã được thêm!");
      setIsPopupOpen(true);
      setTimeout(() => {
        setIsFadeout(true);
        setTimeout(() => {
          setIsPopupOpen(false);
          setIsFadeout(false);
        }, 500);
      }, 1000);
      return;
    } catch (e){
      console.log(e);
      setpopupType("error");
      setpopupTitle("Lỗi");
      setPopupMessage("Phát sinh lỗi khi lưu, vui lòng thử lại!");
      setIsPopupOpen(true);
      return;
    }
    // setCurrentStep(0);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="listCard">
      <Popup
        title={popupTitle}
        message={popupMessage}
        isOpen={isPopupOpen}
        onClose={closePopup}
        type={popupType}
        fadeOut={isFadeout}
      />
      {isLoading ? (
        <div className="MoneyCard">
          <div className="f1 acenter">
            <div className="leap-frog">
              <div className="leap-frog__dot"></div>
              <div className="leap-frog__dot"></div>
              <div className="leap-frog__dot"></div>
            </div>
          </div>
        </div>
      ) : workSheet.length === 0 ? (
        <div className="bg-page">
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
                      Hiện tại bạn chưa làm việc tại công ty và chưa có bảng
                      lương nào, bạn cần thêm công ty và bảng lương để quản lý!
                    </li>
                    <li>
                      Chọn <b>Quét mã</b> để nhập cài đặt bảng lương từ người
                      khác!
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
                  <button className="next" onClick={handleNextStep}>
                    <FontAwesomeIcon icon={icon.faGears}/> Tự thiết lập
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
                      ref={companyName}
                      placeholder="tên công ty..."
                      defaultValue={totalData.companyName?totalData.companyName:"Compal"}
                    />
                  </div>
                  <div className="h-name">Lương cơ bản</div>
                  <div className="h-input">
                    <input
                      ref={salarys}
                      placeholder="lương cơ bản..."
                      defaultValue={totalData.salarys?totalData.salarys:4300000}
                    />
                    <div className="sub-input">VND</div>
                  </div>
                  <div className="h-name">Ngày bắt đầu tính lương</div>
                  <div className="h-input">
                    <input
                      ref={startWorkdate}
                      type="date"
                      defaultValue={
                        totalData.startWorkdate
                          ? totalData.startWorkdate
                          : toDate()
                      }
                    />
                  </div>
                </div>
                <div className="step-buttons">
                  <div className="left">
                    <button className="save" onClick={()=>{handlePreview(3)}}>
                    <FontAwesomeIcon icon={icon.faFloppyDisk} /> Lưu
                    </button>
                  </div>
                  <div className="right">
                    <button className="prev" onClick={handlePrevStep}>
                      Quay lại
                    </button>
                    <button className="next" onClick={handleNextStep}>
                      Phụ cấp
                    </button>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="step-box">
                <div className="logo">
                  <img src={email_4852081} alt="case icon" />
                </div>
                <div className="title">Công và phụ cấp</div>
                <div className="form-group">
                  <div className="h-name">Ngày chốt công</div>
                  <div className="h-input">
                    Ngày
                    <input
                      min={1}
                      max={31}
                      ref={workFinish}
                      type="number"
                      placeholder="ngày chốt công"
                      defaultValue={10}
                    />
                    <div className="sub-input">hàng tháng</div>
                  </div>
                  <div className="h-name">Ngày công tính lương</div>
                  <div className="h-input">
                    <input
                      ref={workDays}
                      type="number"
                      placeholder="số ngày công"
                      defaultValue={26}
                    />
                    <div className="sub-input">ngày công</div>
                  </div>
                  <div className="h-name">Chuyên cần</div>
                  <div className="h-input">
                    <input
                      ref={chuyencan}
                      className="mini"
                      type="number"
                      placeholder="lương chuyên cần"
                      defaultValue={300000}
                    />
                    khi làm đủ
                    <input
                      ref={ngaychuyencan}
                      className="mini2"
                      type="number"
                      placeholder="số ngày"
                      defaultValue={26}
                    />
                    ngày công
                  </div>
                  <div className="h-name">
                    Tổng phụ cấp (tính theo ngày công)
                  </div>
                  <div className="h-input">
                    <input
                      ref={phucap1}
                      type="number"
                      placeholder="phụ cấp cố định"
                      defaultValue={0}
                    />
                    <div className="sub-input">VND</div>
                  </div>
                  <div className="h-name">Tổng phụ cấp (cố định)</div>
                  <div className="h-input">
                    <input
                      ref={phucap2}
                      type="number"
                      placeholder="phụ cấp cố định"
                      defaultValue={0}
                    />
                    <div className="sub-input">VND</div>
                  </div>
                </div>
                <div className="step-buttons">
                  <button className="prev" onClick={handlePrevStep}>
                    Quay lại
                  </button>
                  <button className="next" onClick={handleNextStep}>
                    Tiếp theo
                  </button>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="step-box">
                <div className="logo">
                  <img src={verified} alt="case icon" />
                </div>
                <div className="title">Kiểm tra lại thông tin</div>
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
                      {totalData.chuyencan?(<tr>
                        <td>Ngày chốt công</td>
                        <td>{totalData.chuyencan}</td>
                      </tr>): null}
                      {totalData.phucap1?(<tr>
                        <td>Ngày chốt công</td>
                        <td>{totalData.phucap1}</td>
                      </tr>): null}
                      {totalData.phucap2?(<tr>
                        <td>Ngày chốt công</td>
                        <td>{totalData.phucap2}</td>
                      </tr>): null}
                      {totalData.workFinish?(<tr>
                        <td>Ngày chốt công</td>
                        <td>{totalData.workFinish}</td>
                      </tr>): null}
                      {totalData.workDays?(<tr>
                        <td>Ngày chốt công</td>
                        <td>{totalData.workDays}</td>
                      </tr>): null}
                      <tr>
                        <td>Tổng lương</td>
                        <td>
                          {parseInt(totalData.salarys) +
                            parseInt(totalData.chuyencan)?totalData.chuyencan:0 +
                            parseInt(totalData.phucap1)?totalData.phucap1:0 +
                            parseInt(totalData.phucap2)?totalData.phucap2:0}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="step-buttons">
                  <button className="prev" onClick={handlePrevStep}>
                    <FontAwesomeIcon icon={icon.faPlus}/> Phụ cấp
                  </button>
                  <button className="save" onClick={handleSave}>
                    <FontAwesomeIcon icon={icon.faCheck}/> Hoàn thành
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        workSheet.map((item, index) => (
          <div key={index} className="MoneyCard">
            <div className="company">{item.Company}</div>
            <div className="money">
              <div className="amount">
                {isViewed ? formatCurrency(item.total_salary?item.total_salary:0) : "••• ••• •••"}
              </div>
              <div className="view" onClick={handleViewToggle}>
                <FontAwesomeIcon
                  icon={isViewed ? icon.faEye : icon.faEyeSlash}
                />
              </div>
            </div>
            <Link to={`/luong/${item.id}`} className="caidat">
              <div className="txt">Chi tiết bảng lương</div>
              <div className="icon">
                <FontAwesomeIcon icon={icon.faAngleRight} />
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default MoneyCard;
