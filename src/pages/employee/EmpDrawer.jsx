/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { EmployeeContext } from "./EmployeeLayout";

import { useNavigate } from "react-router-dom";
import "boxicons";


const categories = [
  {
    id: 100,
    mainTitle: "ส่วนหลัก",
    children: [
      {
        id: 101,
        subTitle: "คำสั่งซื้อ",
        icon: <box-icon name="basket" color="#272727"></box-icon>,
        navigete: "/orderEdit",
      },
      {
        id: 102,
        subTitle: "ประวัติ",
        icon: (
          <box-icon type="solid" name="spreadsheet" color="#272727"></box-icon>
        ),
        navigete: "/record",
      },

      {
        id: 103,
        subTitle: "รายงาน",
        icon: <box-icon type="solid" name="report" color="#272727"></box-icon>,

        navigete: "/report",
      },
    ],
  },
  {
    id: 200,
    mainTitle: "การจัดการ",
    children: [
      {
        id: 202,
        subTitle: "สินค้า",
        icon: <box-icon name="package"></box-icon>,
        navigete: "/product",
      },
    ],
  },
];

export default function EmpDrawer() {
  // const { handleOpenSetting } = params;
  let navigate = useNavigate();

  const { notifications, setingShopData } = useContext(EmployeeContext);

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const currentTh = new Date()
      .toLocaleString({
        timeZone: "Asia/Bangkok",
      })
      .split(" ")[1];
    setCurrentTime(currentTh);
  }, []);

  return (
    <div className="flex flex-col justify-between h-[97vh] ">
      <div>
        {categories.map(({ id: cateId, children }) => (
          <div key={cateId}>
            <ul className="menu bg-base-100 rounded-box">
              {children.map(({ id: childId, subTitle, icon, navigete }) => (
                <div key={childId}>
                  <li onClick={() => navigate(navigete)}>
                    <a className="w-36">
                      {icon}
                      <span className="flex flex-wrap w-16">{subTitle}</span>

                      {subTitle === "คำสั่งซื้อ" &&
                      notifications?.countOrderNotPayment &&
                      notifications?.countOrderNotPayment !== "0" ? (
                        <span className="badge badge-sm badge-primary">
                          {notifications?.countOrderNotPayment}{" "}
                        </span>
                      ) : subTitle === "สินค้า" &&
                        notifications?.countMaterialLowStock &&
                        notifications?.countMaterialLowStock !== "0" ? (
                        <span className="badge badge-sm badge-primary">
                          {notifications?.countMaterialLowStock}
                        </span>
                      ) : (
                        <span className="badge-sm"></span>
                      )}

                      {/* {subTitle === "สินค้า" &&
                      notifications?.countMaterialLowStock !== "0" ? (
                        <span className="badge badge-sm badge-primary">
                          {notifications?.countMaterialLowStock}
                        </span>
                      ) : (
                        <span className="badge-sm"></span>
                      )} */}
                    </a>
                  </li>
                </div>
              ))}
            </ul>
            <div className="mt-4"></div>
          </div>
        ))}
      </div>

      <div>
        <ul className="menu bg-base-100 rounded-box">
          <li
            onClick={
              () => navigate("/storeSetting")
              // () => handleOpenSetting()
              // axios.post(`${BaseURL}/order/getCustomerNotifications`);
            }
          >
            <a>
              <box-icon name="home" color="#272727"></box-icon> ร้าน
            </a>
          </li>

          <li>
            <a>
              สถานะ
              {setingShopData?.isOpenShop ? (
                <span className=" badge badge-lg badge-success text-base-content">
                  เปิด
                </span>
              ) : setingShopData?.isCloseShop ? (
                <span className=" badge badge-lg badge-warning text-base-content">
                  ปิด
                </span>
              ) : currentTime > setingShopData?.openDate &&
                currentTime < setingShopData?.closedDate ? (
                <span className=" badge badge-lg badge-success text-base-content">
                  เปิด
                </span>
              ) : (
                <span className=" badge badge-lg badge-warning text-base-content">
                  ปิด
                </span>
              )}
              {/* {setingShopData?.isOpenShop ? (
                <span className="badge badge-md badge-success">เปิด</span>
              ) : (
                <span className="badge badge-md badge-warning">ปิด</span>
              )} */}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
