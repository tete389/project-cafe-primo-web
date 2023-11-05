import { useContext, useState } from "react";

import { useNavigate, Outlet } from "react-router-dom";
import { EmployeeContext } from "./EmployeeLayout";
import { useEffect } from "react";

export default function Product() {
  const { notifications } = useContext(EmployeeContext);
  const tabsValue = [
    {
      tabName: "จัดการสินค้า",
      tabStatus: "menu product",
      navigete: "menuProduct",
    },
    {
      tabName: "จัดการสินค้าคงคลัง",
      tabStatus: "menu material",
      navigete: "menuMaterial",
    },
    {
      tabName: "จัดการหมวดหมู่",
      tabStatus: "menu category",
      navigete: "menuCategory",
    },
    {
      tabName: "จัดการตัวเลือก",
      tabStatus: "menu addon",
      navigete: "menuAddOn",
    },
  ];

  const [tabSelect, setTabSelect] = useState(
    localStorage.getItem("navigeteTab") || "menuProduct"
  );
  const handleTabSelect = (navigete) => {
    setTabSelect(navigete);
    localStorage.setItem("navigeteTab", navigete);
  };
  let navigate = useNavigate();

  useEffect(() => {
    navigate(tabSelect);
  }, []);

  return (
    <main className="flex-none pt-16 overflow-hidden">
      <ul className="w-screen overflow-auto md:overflow-hidden menu flex-nowrap menu-horizontal bg-base-100 scrollerBar">
        {tabsValue?.map((e) => (
          <li
            // className="px-1 w-max md:w-40"
            className="px-1 w-max"
            key={e.tabName}
            onClick={() => {
              handleTabSelect(e.navigete);
              navigate(e.navigete);
            }}
          >
            <a className={`${tabSelect === e.navigete && `active`}`}>
              {e.tabName}
              {e.tabStatus === "menu material" &&
                notifications?.countMaterialLowStock &&
                notifications?.countMaterialLowStock !== "0" && (
                  <span className="badge badge-sm badge-primary">
                    {notifications?.countMaterialLowStock}{" "}
                  </span>
                )}
            </a>
          </li>
        ))}
      </ul>

      <div className="container h-screen mx-auto overflow-hidden pb-[170px]  md:px-10">
        <Outlet />
      </div>
    </main>
  );
}
