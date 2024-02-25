/* eslint-disable react-hooks/rules-of-hooks */
import { BaseURL, findOrderById, haveOrderDetail } from "../service/BaseURL";
import axios from "axios";
import useSWR from "swr";
import ResLoadingScreen from "./ResLoadingScreen";
import ResErrorScreen from "./ResErrorScreen";

export default function ReportDetailPopup(params) {
  const { handleOpenRecordDetail, id } = params;

  const { detailOrder, detailError, detailLoading } = getOrderDetail(id);

  if (detailLoading) {
    return <ResLoadingScreen />;
  }

  if (detailError) {
    return <ResErrorScreen />;
  }
  return (
    <div className="w-screen md:w-[24rem] h-screen">
      <header className="w-full bg-base-100">
        <div className="flex items-center justify-between text-base-content ">
          {/* <p className="p-2 text-4xl stat-value">
            {" "}
            {userLanguage === "th" ? "คำสั่งซื้อของคุณ" : "Your Order "}
          </p> */}
          <button
            className=" btn btn-circle btn-link"
            onClick={() => handleOpenRecordDetail(false)}
          >
            <box-icon
              name="x"
              color="hsl(var(--bc) / var(--tw-text-opacity))"
            ></box-icon>
          </button>
        </div>
      </header>

      <main className="flex flex-col h-full overflow-y-scroll pb-[16rem] bg-base-300 pt-2 scrollerBar">
        <div className="w-[97%] mb-3 ml-2 shadow-md card bg-base-100 text-base-content">
          <div className="card-body ">
            <p className="card-title">
              หมายเลขออเดอร์: Od- {detailOrder?.orderNumber}
            </p>
            <div>
              <ReportDetail detailOrder={detailOrder} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ReportDetail(params) {
  const { detailOrder } = params;

  const manageDate = (orderDateTime) => {
    let orderDate = [];
    if (orderDateTime) {
      const delimiters = /[- ]/;
      const originalString = orderDateTime?.split(delimiters);
      const date = `${originalString[2]}-${originalString[1]}-${originalString[0]}`;
      return date;
    }
    return orderDate;
  };

  const manageTime = (orderDateTime) => {
    let orderTime = [];
    if (orderDateTime) {
      const originalString = orderDateTime;
      orderTime = originalString?.split(" ");
      return orderTime[1];
    }
    return orderTime;
  };

  return (
    <>
      {detailOrder ? (
        <>
          {detailOrder?.customerName &&
            detailOrder?.customerName != "none" &&
            detailOrder?.customerName != "None" && (
              <div className="flex items-center justify-between">
                <p>ชิ่อลูกค้า</p>
                <p className="text-2xl text-end stat-value">
                  {detailOrder?.customerName}
                </p>
              </div>
            )}

          <div className="my-[1px] divider"></div>

          {detailOrder?.orderDetailProducts?.map((e) => (
            <div key={e.odtProdId}>
              <div className="flex justify-between">
                <p> {e.prodNameTh}</p>
                <p className="text-end">{e.prodPrice}</p>
              </div>
              {e.orderDetailOptions?.map((m) => (
                // <>
                <div key={m.odtOptionId} className="flex justify-between pl-5">
                  <p>{m.optionNameTh}</p>
                  <p className="text-end">{m.optionPrice}</p>
                </div>
                // </>
              ))}
              <div className="flex justify-between ">
                <p className="pl-5">จำนวน * {e.quantity}</p>
                <p className="text-end">
                  {e.quantity * (e.optionPrice + e.prodPrice)}
                </p>
              </div>

              <div className="my-[1px] divider"></div>
            </div>
          ))}

          <div className="flex justify-between ">
            <p>ยอดรวมสุทธิ</p>
            <p className="text-end">{detailOrder?.totalDetailPrice}</p>
          </div>
          {detailOrder?.discount !== 0 && (
            <>
              {detailOrder?.orderDetailPoint &&
                detailOrder?.orderDetailPoint?.map((odtp, index) => (
                  <div key={index} className="flex justify-between">
                    {odtp.action === "Spend Points" && (
                      <>
                        <p>ใช้แต้มส่วนลด</p>
                        <p> {odtp.actionPoint} P</p>
                        <p className="text-end">-{detailOrder.discount}</p>
                      </>
                    )}
                  </div>
                ))}
              <div className="flex justify-between ">
                <p>ยอดรวมส่วนลด</p>
                <p className="text-end">
                  {detailOrder.totalDetailPrice - detailOrder.discount}
                </p>
              </div>
            </>
          )}
          <div className="mt-[1px] divider"></div>

          <div className="flex justify-between ">
            <p>ยอดรวม</p>
            <p className="text-end">{detailOrder.orderPrice}</p>
          </div>
          <div className="divider"></div>
          <div className="flex justify-between">
            <p>วันที่ {manageDate(detailOrder.orderDate)}</p>

            <p className="text-end">
              เวลา {/* {orderDateTime[1]} */}
              {manageTime(detailOrder.orderDate)}
            </p>
          </div>
          <div className="flex flex-wrap justify-between">
            <p>สถานะออเดอร์</p>
            <p className="text-xl stat-value text-end">
              <ByCassStatus status={detailOrder?.status} />
            </p>
          </div>
        </>
      ) : (
        <>
          <progress className="w-56 progress"></progress>
          <p> กำลังค้นหาข้อมูล</p>
        </>
      )}

      {/* <p className="text-end">{orderId}</p> */}
      {/* <p className="text-end">{"formPrice"}</p> */}
    </>
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

const fetcherOrderSelect = (url) => axios.get(url).then((res) => res.data.res);
const getOrderDetail = (orderId) => {
  const { data, error, isLoading } = useSWR(
    `${BaseURL}${findOrderById}${orderId}&${haveOrderDetail}`,
    fetcherOrderSelect,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    detailOrder: data,
    detailOrderLoading: isLoading,
    detailOrderError: error,
  };
};
