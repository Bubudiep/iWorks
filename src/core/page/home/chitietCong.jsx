import React, { useState, useEffect } from "react";
import { useUser } from "../../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import ApiClient from "../../../components/api";
import CreateWorkSheet from "./todayWork/create_worksheet";

// Hàm chuyển đổi chuỗi thời gian sang đối tượng Date
function parseTimeString(timeString) {
  return new Date(timeString);
}
function d2string(date2) {
  if (date2) {
    const date = new Date(date2);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
}
const ChitietCong = () => {
  const { userInfo } = useUser();
  const wookSheet = userInfo.workSheet;
  const [wookRecord, setwookRecord] = useState(userInfo.reCord);
  const [bangluong, setBangluong] = useState(false);
  const month = userInfo.month;
  const fetchData = ApiClient();
  let TongNgaydilam = 0,
    TongGiocong = 0,
    TongGiotangca = 0,
    ngay_NgayHanhchinh = 0,
    ngay_GioHanhchinh = 0,
    ngay_GioTangca = 0,
    ngay_Tangca = 0,
    ngay_Chunhat = 0,
    ngay_Giochunhat = 0,
    ngay_Le = 0,
    ngay_Giole = 0,
    dem_NgayHanhchinh = 0,
    dem_GioHanhchinh = 0,
    dem_GioTangca = 0,
    dem_Tangca = 0,
    dem_Chunhat = 0,
    dem_Giochunhat = 0,
    dem_Le = 0,
    dem_Giole = 0;
  const date = new Date(new Date().setMonth(month - 1));
  console.log(date);
  const [firstDay, setFirstDay] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [lastDay, setLastDay] = useState(
    new Date(date.getFullYear(), date.getMonth() + 1, 0)
  );

  useEffect(() => {
    const loadRecord = async () => {
      const dataRecords = await fetchData.gets(
        `/workrecord?per_page=99&range_date=${d2string(firstDay)}_${d2string(
          lastDay
        )}`,
        userInfo.login.token
      );
      console.log(dataRecords);
      setwookRecord(dataRecords.items);
    };
    loadRecord();
  }, [firstDay, lastDay]);
  if (wookRecord) {
    wookRecord.forEach((entry) => {
      if (entry.isWorking) {
        TongNgaydilam += 1;
        // Nếu có thời gian bắt đầu và kết thúc
        const startTime = parseTimeString(
          entry.startTime ? entry.startTime : entry.workDate + " 08:00:00"
        );
        const endTime = parseTimeString(
          entry.endTime ? entry.endTime : entry.workDate + " 17:00:00"
        );
        // Tính số giờ làm việc
        let workingHours = (endTime - startTime) / (1000 * 60 * 60); // Chuyển đổi milliseconds sang hours
        if (workingHours > 5) workingHours -= 1;
        // Kiểm tra xem ngày làm việc có phải là Chủ nhật không
        const workDate = parseTimeString(entry.workDate);
        const dayOfWeek = workDate.getDay(); // 0: Chủ nhật, 1: Thứ Hai, ..., 6: Thứ Bảy

        if (
          new Date(startTime).getHours() > 5 &&
          new Date(startTime).getHours() < 15
        ) {
          // Nếu là ca ngày
          if (entry.offRate == 3) {
            ngay_Le += 1;
            ngay_Giole += workingHours;
            TongGiotangca += workingHours;
          } else if (dayOfWeek !== 0) {
            // Không phải Chủ nhật
            ngay_NgayHanhchinh += 1;
            ngay_GioHanhchinh += workingHours;
            ngay_GioTangca += entry.overTime;
            if (entry.overTime) {
              ngay_Tangca += 1;
            }
            TongGiocong += workingHours;
          } else {
            ngay_Chunhat += 1;
            ngay_Giochunhat += workingHours;
            TongGiotangca += workingHours;
          }
        } else {
          if (entry.offRate == 3) {
            dem_Le += 1;
            dem_Giole += workingHours;
            TongGiotangca += workingHours;
          } else if (dayOfWeek !== 0) {
            // Không phải Chủ nhật
            dem_NgayHanhchinh += 1;
            dem_GioHanhchinh += workingHours;
            dem_GioTangca += entry.overTime;
            if (entry.overTime) {
              dem_Tangca += 1;
            }
            TongGiocong += workingHours;
          } else {
            dem_Chunhat += 1;
            dem_Giochunhat += workingHours;
            TongGiotangca += workingHours;
          }
        }
        // Cộng số giờ tăng ca
        TongGiotangca += entry.overTime;
      }
    });
  }
  const handleBangluong = () => {
    setBangluong(true);
  };
  const dashboardData = [
    { title: "Đi làm", value: TongNgaydilam, unit: "ngày" },
    { title: "Giờ công", value: TongGiocong, unit: "giờ" },
    { title: "Tăng ca", value: TongGiotangca, unit: "giờ" },
  ];
  // Tạo dữ liệu dựa trên loại ca làm việc
  let workDetails = [];
  console.log(wookSheet);
  wookSheet.Calamviec = "2CA";
  if (wookSheet.Calamviec === "HC") {
    // Hành chính - chỉ có ca ngày
    workDetails = [
      {
        category: "Hành chính",
        shifts: [
          { type: "HC", rate: ngay_NgayHanhchinh, hours: ngay_GioHanhchinh },
        ],
      },
      {
        category: "Tăng ca",
        shifts: [{ type: "HC", rate: ngay_Tangca, hours: ngay_GioTangca }],
      },
      {
        category: "Chủ nhật",
        shifts: [{ type: "HC", rate: ngay_Chunhat, hours: ngay_Giochunhat }],
      },
      {
        category: "Ngày lễ",
        shifts: [{ type: "HC", rate: ngay_Le, hours: ngay_Giole }],
      },
    ];
  } else if (wookSheet.Calamviec === "2CA") {
    // 2 ca - có ca ngày và ca đêm
    workDetails = [
      {
        category: "Hành chính",
        shifts: [
          { type: "Ngày", rate: ngay_NgayHanhchinh, hours: ngay_GioHanhchinh },
          { type: "Đêm", rate: dem_NgayHanhchinh, hours: dem_GioHanhchinh },
        ],
      },
      {
        category: "Tăng ca",
        shifts: [
          { type: "Ngày", rate: ngay_Tangca, hours: ngay_GioTangca },
          { type: "Đêm", rate: dem_Tangca, hours: dem_GioTangca },
        ],
      },
      {
        category: "Chủ nhật",
        shifts: [
          { type: "Ngày", rate: ngay_Chunhat, hours: ngay_Giochunhat },
          { type: "Đêm", rate: dem_Chunhat, hours: dem_Giochunhat },
        ],
      },
      {
        category: "Ngày lễ",
        shifts: [
          { type: "Ngày", rate: ngay_Le, hours: ngay_Giole },
          { type: "Đêm", rate: dem_Le, hours: dem_Giole },
        ],
      },
    ];
  } else if (wookSheet.Calamviec === "3CA") {
    // 3 ca - có ca 1, ca 2 và ca 3
    workDetails = [
      {
        category: "Hành chính",
        shifts: [
          { type: "Ca 1", rate: "100%", hours: 0 },
          { type: "Ca 2", rate: "130%", hours: 0 },
          { type: "Ca 3", rate: "150%", hours: 0 },
        ],
      },
      {
        category: "Tăng ca",
        shifts: [
          { type: "Ca 1", rate: "150%", hours: 0 },
          { type: "Ca 2", rate: "180%", hours: 0 },
          { type: "Ca 3", rate: "200%", hours: 0 },
        ],
      },
      {
        category: "Chủ nhật",
        shifts: [
          { type: "Ca 1", rate: "200%", hours: 0 },
          { type: "Ca 2", rate: "270%", hours: 0 },
          { type: "Ca 3", rate: "300%", hours: 0 },
        ],
      },
      {
        category: "Ngày lễ",
        shifts: [
          { type: "Ca 1", rate: "300%", hours: 0 },
          { type: "Ca 2", rate: "390%", hours: 0 },
          { type: "Ca 3", rate: "450%", hours: 0 },
        ],
      },
    ];
  }

  return (
    <div className="fc g10 w90 z1">
      {bangluong ? (
        <CreateWorkSheet />
      ) : (
        <>
          <div className="ngaychotcong">
            <div className="range-date">
              <input
                type="date"
                value={d2string(firstDay)}
                onChange={(e) => setFirstDay(e.target.value)}
              />
              đến
              <input
                type="date"
                value={d2string(lastDay)}
                onChange={(e) => setLastDay(e.target.value)}
              />
            </div>
            <div className="set-date">
              <FontAwesomeIcon icon={icon.faGears} />
            </div>
          </div>
          <div className="chitietCong">
            <div className="header">
              <div className="name">
                Bảng công Tháng {month}
                {wookSheet.Company && " tại " + wookSheet.Company}
              </div>
            </div>
            <div className="body">
              <div className="ngaycong-dasboard">
                {dashboardData.map((item, index) => (
                  <div className="box" key={index}>
                    <div className="title">{item.title}</div>
                    <div className="value">
                      {item.value}
                      <div className="unit">{item.unit}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hr1 mgt10">Chi tiết</div>
              <div className="details_box">
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Phân loại</th>
                      <th>Ca</th>
                      <th>Ngày</th>
                      <th>Giờ</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {workDetails.map((item, index) => (
                      <React.Fragment key={index}>
                        {item.shifts.map((shift, subIndex) => (
                          <tr
                            className={subIndex > 0 ? "sub" : "nosub"}
                            key={subIndex}
                          >
                            {subIndex === 0 && (
                              <td className="num" rowSpan={item.shifts.length}>
                                {index + 1}
                              </td>
                            )}
                            {subIndex === 0 && (
                              <td
                                className="catalog"
                                rowSpan={item.shifts.length}
                              >
                                {item.category}
                              </td>
                            )}
                            <td>{shift.type}</td>
                            <td className="righttx">
                              {shift.rate} <div className="unit">ngày</div>
                            </td>
                            <td className="righttx">
                              {shift.hours} <div className="unit">giờ</div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {wookSheet?.WorkSalary.length ? (
            <>
              <div className="more-btn">
                <div className="text">Lương tạm tính</div>
                <div className="logo">
                  <FontAwesomeIcon icon={icon.faAnglesRight} />
                </div>
              </div>
              <div className="more-btn" onClick={handleBangluong}>
                <div className="text">Cài đặt tính lương tự động</div>
                <div className="logo">
                  <FontAwesomeIcon icon={icon.faAnglesRight} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="more-btn" onClick={handleBangluong}>
                <div className="text">Cài đặt tính lương tự động</div>
                <div className="logo">
                  <FontAwesomeIcon icon={icon.faAnglesRight} />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ChitietCong;
