/* eslint-disable react-hooks/rules-of-hooks */
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useState } from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import {
  BaseURL,
  dateEnd,
  dateStart,
  findRecentOrder,
  pageNum,
  pageSize,
  statusOrder,
} from "../../service/BaseURL";
import axios from "axios";
import useSWR from "swr";

import { SwipeableDrawer } from "@mui/material";
import ReportDetailPopup from "../../components/ReportDetailPopup";
import DrawerRightW24Rem from "../../components/DrawerRightW24Rem";
import ResErrorScreen from "../../components/ResErrorScreen";
import ResLoadingScreen from "../../components/ResLoadingScreen";
import "dayjs/locale/th";

export default function Record() {
  // const { openDrawerRight, handleOpenRecordDetail } =
  //   useContext(EmployeeContext);

  const [openDrawerRight, setOpenDrawerRight] = useState({
    openRecordDetail: false,
    id: "",
  });

  const handleOpenRecordDetail = (newOpen, id) => {
    setOpenDrawerRight({
      openRecordDetail: newOpen,
      id: id,
    });
  };

  return (
    <main className="pt-16 overflow-hidden ">
      <div className="w-screen bg-base-100">
        <p className="pt-0 pb-1 text-2xl font-extrabold stat text-base-content">
          ประวัติคำสั่งซื้อ
        </p>
      </div>
      <div className="container h-screen mx-auto overflow-hidden pb-[190px] sm:max-w-lg md:mx-0 md:ml-10">
        <TabBody
          openDrawerRight={openDrawerRight}
          handleOpenRecordDetail={handleOpenRecordDetail}
        />
      </div>

      {/* Drawer */}
      <DrawerRightW24Rem>
        {openDrawerRight.openRecordDetail && (
          <ReportDetailPopup
            handleOpenRecordDetail={handleOpenRecordDetail}
            id={openDrawerRight.id}
          />
        )}
      </DrawerRightW24Rem>

      <SwipeableDrawer
        anchor="right"
        variant="temporary"
        open={openDrawerRight.openRecordDetail}
        onClose={() => handleOpenRecordDetail(false)}
        onOpen={() => handleOpenRecordDetail(true)}
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
        {openDrawerRight.openRecordDetail && (
          <ReportDetailPopup
            handleOpenRecordDetail={handleOpenRecordDetail}
            id={openDrawerRight.id}
          />
        )}
      </SwipeableDrawer>
    </main>
  );
}

function ByCassStatus(params) {
  const { status } = params;

  switch (status) {
    case "Payment":
      return <>รอชำระเงิน</>;
    case "Making":
      return <>กำลังทำ</>;
    case "Receive":
      return <>รอรับสินค้า</>;
    case "Success":
      return <>สำเร็จออเดอร์</>;
    case "Keep":
      return <>จัดการภายหลัง</>;
    case "Cancel":
      return <>ยกเลิก</>;
    default:
      return <>อยู่ระหว่างการแก้ไข</>;
  }
}

function TabBody(params) {
  const { openDrawerRight, handleOpenRecordDetail } = params;

  const currentTh = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Bangkok",
    })
  );

  const [selectDate, setSelectDate] = useState(dayjs(currentTh));

  function handleDate(newDate) {
    setSelectDate(newDate);
  }

  return (
    <>
      <div className="px-10 py-2 mt-1 h-max rounded-t-md bg-base-200">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
          <DemoContainer
            components={["DatePicker", "MobileDatePicker", "DesktopDatePicker"]}
          >
            {/* <DemoItem label="เลือกวันที่"> */}
            <DesktopDatePicker
              label={<span className="text-xl">เลือกวันที่</span>}
              format="DD-MM-YYYY"
              value={selectDate}
              onChange={(newDate) => handleDate(newDate)}
              className="w-full bg-base-100"
            />
            {/* </DemoItem> */}
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <section className="h-full pb-0 overflow-x-auto scrollerBar rounded-b-md bg-base-100">
        <ListRecentOrder
          currentTh={currentTh}
          selectDate={selectDate}
          openDrawerRight={openDrawerRight}
          handleOpenRecordDetail={handleOpenRecordDetail}
        />
      </section>
    </>
  );
}

function ListRecentOrder(params) {
  const { currentTh, selectDate, openDrawerRight, handleOpenRecordDetail } =
    params;

  const date = `${currentTh.getFullYear()}-${
    currentTh.getMonth() + 1
  }-${currentTh.getDate()}`;

  const dateToRecent = `${selectDate.year()}-${
    selectDate.month() + 1
  }-${selectDate.date()}`;

  const { recentOrder, recentOrderLoading, recentOrdersError } = getRecentOrder(
    dateToRecent || date,
    dateToRecent || date,
    30,
    0
  );

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
    return <ResLoadingScreen />;
  }

  if (recentOrdersError) {
    return <ResErrorScreen />;
  }

  if (recentOrder && !recentOrder.length) {
    return (
      <div className="items-center justify-center w-full bg-white rounded-t-none h-36 card">
        <span> ไม่พบข้อมูล </span>
      </div>
    );
  }

  return (
    <>
      {recentOrder?.map((e, index) => (
        <div
          key={index}
          className="w-full "
          onClick={() => handleOpenRecordDetail(true, e.orderId)}
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
                  <>
                    <span>สถานะ</span>
                    <p className="text-base">
                      <ByCassStatus status={e.status} />
                    </p>
                  </>
                </div>

                <span>
                  {e.customerName === "none"
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
const getRecentOrder = (dStart, dEnd, pSize, pNum) => {
  // const status = "Wait Payment";
  const status = "All";
  const { data, error, isLoading } = useSWR(
    `${BaseURL}${findRecentOrder}?${dateStart}${dStart}&${dateEnd}${dEnd}&${statusOrder}${status}&${pageSize}${pSize}&${pageNum}${pNum}`,
    fetcherRecentOrder
    // {
    //   revalidateIfStale: false,
    //   revalidateOnFocus: false,
    //   revalidateOnReconnect: false,
    // }
  );
  return {
    recentOrder: data,
    recentOrderLoading: isLoading,
    recentOrderError: error,
  };
};
