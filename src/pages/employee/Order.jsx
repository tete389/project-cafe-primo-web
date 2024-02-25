/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
// import {
//   BaseURL,
//   dateEnd,
//   dateStart,
//   findRecentOrder,
//   pageNum,
//   pageSize,
//   statusOrder,
// } from "../service/BaseURL";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import { useContext } from "react";
import { EmployeeContext } from "./EmployeeLayout";
import { SwipeableDrawer } from "@mui/material";
import {
  BaseURL,
  dateEnd,
  dateStart,
  findRecentOrder,
  pageNum,
  pageSize,
  statusOrder,
} from "../../service/BaseURL";
import OrderDetailPopup from "../../components/OrderDetailPopup";
import DrawerRightW24Rem from "../../components/DrawerRightW24Rem";

export default function Order() {
  const [tabSelect, setTabSelect] = useState("Payment");

  const currentTh = new Date().toLocaleDateString("en-US", {
    timeZone: "Asia/Bangkok",
  });
  const toDateTh1 = currentTh.split("/");
  const dateTh1 = `${toDateTh1[2]}-${toDateTh1[0]}-${toDateTh1[1]}`;

  const url = `${BaseURL}${findRecentOrder}?${dateStart}${dateTh1}&${dateEnd}${dateTh1}&${statusOrder}${tabSelect}&${pageSize}30&${pageNum}0`;

  const [openDrawerRight, setOpenDrawerRight] = useState({
    openOrderDetail: false,
    id: "",
  });

  const handleTabSelect = (newTab) => {
    setTabSelect(newTab);
  };

  const handleOpenOrderDetail = (newOpen, id) => {
    setOpenDrawerRight({
      openOrderDetail: newOpen,
      id: id,
    });
  };

  return (
    <main className="flex-none pt-16 overflow-hidden ">
      <div className="w-screen bg-base-100 z-[9999]">
        <p className="pt-0 pb-1 text-2xl font-extrabold stat text-base-content">
          คำสั่งซื้อ
        </p>
      </div>
      <div className="container h-screen mx-auto overflow-hidden pb-[190px] sm:max-w-lg md:mx-0 md:ml-10 ">
        <TabBody
          tabSelect={tabSelect}
          handleTabSelect={handleTabSelect}
          handleOpenOrderDetail={handleOpenOrderDetail}
          openDrawerRight={openDrawerRight}
          OrderUrl={url}
        />
      </div>

      {/* Drawer */}
      <DrawerRightW24Rem>
        {openDrawerRight.openOrderDetail && (
          <OrderDetailPopup
            handleOpenOrderDetail={handleOpenOrderDetail}
            id={openDrawerRight.id}
            OrderUrl={url}
          />
        )}
      </DrawerRightW24Rem>

      <SwipeableDrawer
        anchor="right"
        variant="temporary"
        open={openDrawerRight.openOrderDetail}
        onClose={() => handleOpenOrderDetail(false)}
        onOpen={() => handleOpenOrderDetail(true)}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          zIndex: "10000",
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            overflow: "hidden",
          },
        }}
      >
        {openDrawerRight.openOrderDetail && (
          <OrderDetailPopup
            handleOpenOrderDetail={handleOpenOrderDetail}
            id={openDrawerRight.id}
            OrderUrl={url}
          />
        )}
      </SwipeableDrawer>
    </main>
  );
}

function TabBody(params) {
  const {
    tabSelect,
    handleTabSelect,
    handleOpenOrderDetail,
    openDrawerRight,
    OrderUrl,
  } = params;

  const tabsValue = [
    { tabName: "รอชำระ", tabStatus: "Payment" },
    { tabName: "กำลังทำ", tabStatus: "Making" },
    { tabName: "รอรับสินค้า", tabStatus: "Receive" },
    // { tabName: "สำเร็จออเดอร์", tabStatus: "Success" },
    // { tabName: "ยกเลิก", tabStatus: "Cancel"},
    { tabName: "ภายหลัง", tabStatus: "Keep" },
  ];
  const { notifications } = useContext(EmployeeContext);
  return (
    <>
      <ul className="w-full py-3 overflow-auto rounded-md menu flex-nowrap menu-horizontal bg-base-300 scrollerBar lg:justify-center">
        {tabsValue.map((e) => (
          <div className="indicator" key={e.tabName}>
            <IndicatorByStatus
              tabStatus={e.tabStatus}
              notifications={notifications}
            />
            <li
              className={`w-max h-max ${
                e.tabStatus === "Keep" ? `pl-10 pr-1` : ` px-1`
              }`}
              onClick={() => {
                handleTabSelect(e.tabStatus);
                // navigate(e.navigete);
              }}
            >
              <a
                className={`${
                  e.tabStatus === tabSelect
                    ? `active`
                    : e.tabStatus === "Keep"
                    ? `bg-base-300`
                    : `bg-base-200`
                } px-4 min-w-[5rem] justify-center text-xl py-3`}
              >
                {e.tabName}
              </a>
            </li>
          </div>
        ))}
      </ul>

      <section className="h-full pb-0 overflow-x-auto scrollerBar rounded-b-md">
        <ListOrder
          tabStatus={tabSelect}
          handleOpenOrderDetail={handleOpenOrderDetail}
          OrderUrl={OrderUrl}
          openDrawerRight={openDrawerRight}
        />
      </section>
    </>
  );
}

function IndicatorByStatus(params) {
  const { tabStatus, notifications } = params;

  switch (tabStatus) {
    case "Payment":
      return (
        <>
          {notifications?.countOrderNotPayment &&
            notifications?.countOrderNotPayment !== "0" && (
              <span className="indicator-item indicator-center badge badge-primary">
                {notifications?.countOrderNotPayment}
              </span>
            )}
        </>
      );
    case "Making":
      return (
        <>
          {notifications?.countOrderMaking &&
            notifications?.countOrderMaking !== "0" && (
              <span className="indicator-item indicator-center badge badge-info text-base-100">
                {notifications?.countOrderMaking}
              </span>
            )}
        </>
      );
    case "Receive":
      return (
        <>
          {notifications?.countOrderReceive &&
            notifications?.countOrderReceive !== "0" && (
              <span className="indicator-item indicator-center badge btn-warning text-base-100 ">
                {notifications?.countOrderReceive}
              </span>
            )}
        </>
      );
    case "Keep":
      return (
        <>
          {notifications?.countOrderKeep &&
            notifications?.countOrderKeep !== "0" && (
              <span className="indicator-item indicator-center badge badge-neutral text-base-100">
                {notifications?.countOrderKeep}
              </span>
            )}
        </>
      );
    default:
      return <></>;
  }
}

function ListOrder(params) {
  const { tabStatus, handleOpenOrderDetail, OrderUrl, openDrawerRight } =
    params;
  const { notifications } = useContext(EmployeeContext);

  const { recentOrder, recentOrderLoading, recentOrdersError } =
    getRecentOrder(OrderUrl);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (
      tabStatus === "Payment" &&
      notifications?.countOrderNotPayment !== recentOrder?.length
    ) {
      mutate(OrderUrl);
    }
  }, [notifications?.countOrderNotPayment]);

  const dateTime = (orderDate) => {
    let orderDateTime = [];
    if (orderDate) {
      const originalString = orderDate;
      orderDateTime = originalString?.split(" ");
      return orderDateTime[1];
    }
    return orderDateTime;
  };

  if (recentOrderLoading) {
    return (
      <div className="items-center justify-center w-full bg-white rounded-t-none h-36 card">
        <progress className="w-56 progress"></progress>
      </div>
    );
  }

  if (recentOrder && !recentOrder.length) {
    return (
      <div className="items-center justify-center w-full bg-white rounded-t-none h-36 card">
        <span> ไม่พบข้อมูล </span>
      </div>
    );
  }

  if (recentOrdersError) {
    return (
      <div className="items-center justify-center w-full bg-white rounded-t-none h-36 card">
        <span> โหลดข้อมูลล้มเหลว </span>
      </div>
    );
  }

  return (
    <>
      {recentOrder?.map((e, index) => (
        <div
          key={index}
          className="w-full "
          onClick={() => handleOpenOrderDetail(true, e.orderId)}
        >
          <div
            className={`w-full   shadow-md   ${
              openDrawerRight.id === e.orderId ? `bg-base-200` : `bg-base-100`
            }`}
          >
            <div className="card-body">
              <div className="flex flex-row justify-between card-title">
                <div className="flex flex-col gap-1">
                  <span>#Od-{e.orderNumber} </span>
                </div>

                <span>
                  {e.customerName === "none" || e.customerName === "None"
                    ? ""
                    : "ชื่อลูกค้า: " + e.customerName}
                </span>

                <div className="flex flex-col gap-1 ">
                  <span>฿ {e.orderPrice}</span>
                  <span className="text-base">{dateTime(e.orderDate)}</span>
                </div>
              </div>
            </div>
          </div>
          {recentOrder?.length - 1 !== index && <div className="h-[1px]"></div>}
        </div>
      ))}
    </>
  );
}

const fetcherRecentOrder = (url) => axios.get(url).then((res) => res.data.res);
const getRecentOrder = (recentUrl) => {
  const { data, error, isLoading } = useSWR(recentUrl, fetcherRecentOrder, {
    revalidateOnFocus: false,
  });
  return {
    recentOrder: data,
    recentOrderLoading: isLoading,
    recentOrderError: error,
    // recentOrderMutate: mutate,
  };
};

// const fetcherRecentOrder = (url) => axios.get(url).then((res) => res.data.res);
// const getRecentOrder = (dStart, dEnd, pSize, pNum, stats) => {
//   // const status = "Wait Payment";
//   // const status = "ALL";
//   const { data, error, isLoading } = useSWR(
//     `${BaseURL}${findRecentOrder}?${dateStart}${dStart}&${dateEnd}${dEnd}&${statusOrder}${stats}&${pageSize}${pSize}&${pageNum}${pNum}`,
//     fetcherRecentOrder
//     // {
//     //   revalidateIfStale: false,
//     //   revalidateOnFocus: false,
//     //   revalidateOnReconnect: false,
//     // }
//   );
//   return {
//     recentOrder: data,
//     recentOrderLoading: isLoading,
//     recentOrderError: error,
//   };
// };
