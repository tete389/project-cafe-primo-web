/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useState } from "react";

import {
  BaseURL,
  findOrderById,
  findOrderByIdList,
  getNotificationsCustomer,
  haveOrderDetail,
} from "../service/BaseURL";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
let stompClient = null;
import useSWR from "swr";
import axios from "axios";
import ResLoadingScreen from "./ResLoadingScreen";
import ResErrorScreen from "./ResErrorScreen";
import DialogCollectPoint from "./DialogCollectPoint";
import { LanguageContext } from "../pages/customer/Store";

export default function FollowOrderPopup(params) {
  const { handleOpenFollowOrder, followOrder, setfollowOrder } = params;

  // const { detailOrderAll, detailOrderAllLoading, detailOrderAllError } =
  // getOrderDetailAll(listOrderId, orderUrl);

  // console.log(listOrderId);
  const userLanguage = useContext(LanguageContext);
  const [orderRes, setOrderRes] = useState([]);
  const [notificationsCus, setNotificationsCus] = useState();

  const [orderSelect, setOrderSelect] = useState({});
  const handleOrderSelect = (newSelect) => {
    if (orderSelect[newSelect] === true) {
      setOrderSelect((prev) => ({
        ...prev,
        [newSelect]: false,
      }));
    } else {
      setOrderSelect((prev) => ({
        ...prev,
        [newSelect]: true,
      }));
    }
  };

  const deleteOrder = (index) => {
    const toDelete = followOrder?.filter(
      (bv, menuIndex) => menuIndex !== index
    );
    setfollowOrder(toDelete);
  };

  /////////  fetcher /////////
  const fetcherOrder = () => {
    const listOrderId = [];
    if (followOrder?.length > 0) {
      for (const order of followOrder) {
        listOrderId.push(order.orderId);
      }
    }

    if (notificationsCus) {
      if (!listOrderId.includes(notificationsCus?.orderId)) {
        return;
      }
    }

    let dataJson = JSON.stringify({ orderIds: listOrderId });
    let customConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const fetcherResOrder = async () => {
      try {
        const response = await axios.post(
          `${BaseURL}${findOrderByIdList}`,
          dataJson,
          customConfig
        );
        const data = await response.data.res;

        setOrderRes(data);
      } catch (error) {
        console.error("error : ", error);
      }
    };

    if (listOrderId.length > 0) {
      fetcherResOrder();
    }
  };

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

  const toGetNotifications = async () => {
    const socket = new SockJS(`${BaseURL}/ws`);
    stompClient = over(socket);

    try {
      await stompClient.connect({}, () => {
        stompClient.subscribe(
          "/topic/customer_notifications",
          (notification) => {
            setNotificationsCus(JSON.parse(notification.body));
          }
        );
        // axios.post(`${BaseURL}${getNotificationsCustomer}`);
      });
    } catch (error) {
      console.error("error : ", error);
    }
  };

  useEffect(() => {
    toGetNotifications();
    return () => {
      stompClient.disconnect();
    };
  }, []);

  useEffect(() => {
    fetcherOrder();
  }, [notificationsCus]);

  return (
    <div className="w-screen md:w-[30rem] h-screen">
      <header className="w-full bg-base-100">
        <div className="flex items-center justify-between text-base-content ">
          <p className="p-2 text-4xl stat-value">
            {" "}
            {userLanguage === "th" ? "คำสั่งซื้อของคุณ" : "Your Order "}
          </p>
          <button
            className=" btn btn-circle btn-link"
            onClick={() => handleOpenFollowOrder(false)}
          >
            <box-icon
              name="x"
              color="hsl(var(--bc) / var(--tw-text-opacity))"
            ></box-icon>
          </button>
        </div>
      </header>

      <main className="flex flex-col h-full overflow-y-scroll pb-[16rem] bg-base-300 pt-2 scrollerBar">
        {orderRes?.map((e, index) => (
          <div
            key={index}
            className={`mx-2 mb-3 shadow-md card text-base-content  bg-base-100 `}
          >
            {/* <button
              className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
              onClick={() => deleteOrder(index)}
            >
              <box-icon
                name="trash-alt"
                type="solid"
                color="hsl(var(--bc) / var(--tw-text-opacity))"
              ></box-icon>
            </button> */}
            <div className={`pt-10 rounded-t-xl  ${
              e.status === "Success"
                ? "bg-success"
                : e.status === "Receive"
                ? "bg-warning"
                : e.status === "Making"
                ? "bg-info"
                : e.status === "Cancel"
                ? "bg-error"
                : "bg-base-100"
            } `}></div>
            <div className="pt-0 mt-0 card-body">
              <p className="text-2xl font-bold card-title">
                {userLanguage === "th"
                  ? "หมายเลขออเดอร์: Od-" + e.orderNumber
                  : "Order Number: Od-" + e.orderNumber}
              </p>

              <div className=" collapse collapse-arrow join-item">
                <input
                  type="checkbox"
                  name="my-accordion-4"
                  defaultChecked={false}
                  className="h-10 min-h-0"
                  onChange={() => handleOrderSelect(index)}
                />
                <div className="flex items-center h-10 min-h-0 px-0 text-xl font-medium opacity-50 collapse-title ">
                  {userLanguage === "th" ? "รายละเอียด" : "detail"}
                </div>
                <div className="px-0 collapse-content">
                  {orderSelect[index] !== "" && orderSelect[index] ? (
                    <FollowOrderDetail orderId={e.orderId} />
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <>
                <div className="mt-[1px] divider mb-[1px]"></div>

                <div className="flex justify-between ">
                  <p>{userLanguage === "th" ? "ยอดรวม" : "Total "}</p>
                  <p className="text-end">{e.orderPrice}</p>
                </div>
                <div className="mt-[1px] divider mb-[1px]"></div>
                <div className="flex justify-between">
                  <p>
                    {userLanguage === "th" ? "วันที่ : " : "Date"}
                    {manageDate(e.orderDate)}
                  </p>

                  <p className="text-end">
                    {userLanguage === "th" ? "เวลา : " : "Time"}

                    {manageTime(e.orderDate)}
                  </p>
                </div>
                <div className="flex flex-wrap">
                  <p>
                    {userLanguage === "th" ? "สถานะออเดอร์" : "Order Status"}
                  </p>
                  <p className="text-2xl font-extrabold text-center">
                    <ByCassStatus
                      status={e.status}
                      userLanguage={userLanguage}
                    />
                  </p>
                </div>
              </>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

function FollowOrderDetail(params) {
  const { orderId } = params;
  const userLanguage = useContext(LanguageContext);
  const orderUrl = `${BaseURL}${findOrderById}${orderId}&${haveOrderDetail}`;
  const { detailOrder, detailError, detailLoading } = getOrderDetail(
    orderId,
    orderUrl
  );

  if (detailLoading) {
    return <ResLoadingScreen />;
  }

  if (detailError) {
    return <ResErrorScreen />;
  }

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
            detailOrder?.customerName !== "none" && (
              <div className="flex justify-between text-2xl font-bold">
                <p>{userLanguage === "th" ? "ชื่อลูกค้า" : "Customer Name"}</p>
                <p className="text-end">{detailOrder?.customerName}</p>
              </div>
            )}

          <div className="my-[1px] divider"></div>

          {detailOrder?.orderDetailProducts?.map((e) => (
            <div key={e.odtProdId}>
              <div className="flex justify-between">
                <p>{userLanguage === "th" ? e.prodNameTh : e.prodNameEng}</p>
                <p className="text-end">{e.prodPrice}</p>
              </div>
              {e.orderDetailOptions?.map((m) => (
                // <>
                <div key={m.odtOptionId} className="flex justify-between pl-5">
                  <p>
                    {userLanguage === "th" ? m.optionNameTh : m.optionNameEng}
                  </p>
                  <p className="text-end">{m.optionPrice}</p>
                </div>
                // </>
              ))}
              <div className="flex justify-between ">
                <p className="pl-5">
                  {userLanguage === "th"
                    ? "จำนวน *" + e.quantity
                    : "quantity *" + e.quantity}
                </p>
                <p className="text-end">
                  {e.quantity * (e.optionPrice + e.prodPrice)}
                </p>
              </div>

              <div className="my-[1px] divider"></div>
            </div>
          ))}

          <div className="flex justify-between ">
            <p>{userLanguage === "th" ? "ยอดรวมสุทธิ" : "net amount"}</p>
            <p className="text-end">{detailOrder?.totalDetailPrice}</p>
          </div>
          {detailOrder?.discount !== 0 && (
            <>
              {/* <div className="my-[1px] divider"></div> */}
              {detailOrder?.orderDetailPoint &&
                detailOrder?.orderDetailPoint?.map((odtp, index) => (
                  <div key={index} className="flex justify-between">
                    {odtp.action === "Spend Points" && (
                      <>
                        <p>
                          {userLanguage === "th"
                            ? "ใช้แต้มส่วนลด"
                            : "Spend Point"}
                        </p>
                        <p> {odtp.actionPoint} P</p>
                        <p className="text-end">-{detailOrder.discount}</p>
                      </>
                    )}
                  </div>
                ))}
              <div className="flex justify-between ">
                <p>
                  {userLanguage === "th" ? "ยอดรวมส่วนลด" : "discount amount"}
                </p>
                <p className="text-end">
                  {detailOrder.totalDetailPrice - detailOrder.discount}
                </p>
              </div>
            </>
          )}
          {/* <div className="mt-[1px] divider"></div>

          <div className="flex justify-between ">
            <p>{userLanguage === "th" ? "ยอดรวม" : "Total "}</p>
            <p className="text-end">{detailOrder.orderPrice}</p>
          </div>
          <div className="divider"></div>
          <div className="flex justify-between">
            <p>
              {userLanguage === "th" ? "วันที่ : " : "Date"}
              {manageDate(detailOrder.orderDate)}
            </p>

            <p className="text-end">
              {userLanguage === "th" ? "เวลา : " : "Time"}

              {manageTime(detailOrder.orderDate)}
            </p>
          </div>
          <div className="flex flex-wrap">
            <p>{userLanguage === "th" ? "สถานะออเดอร์" : "Order Status"}</p>
            <p className="text-2xl font-extrabold text-center">
              <ByCassStatus
                status={detailOrder.status}
                userLanguage={userLanguage}
              />
            </p>
          </div> */}
          {/* {detailOrder.status === "Success" && (
            <ButtonTabTakePoints
              orderId={detailOrder?.orderId}
              orderDetailPoint={detailOrder?.orderDetailPoint}
              orderUrl={orderUrl}
              orderPrice={detailOrder?.orderPrice}
            />
          )} */}
        </>
      ) : (
        <>
          <progress className="w-56 progress"></progress>
          <p> {userLanguage === "th" ? "กำลังค้นหาข้อมูล" : "Searching"}</p>
        </>
      )}
    </>
  );
}

function ButtonTabTakePoints(params) {
  const { orderId, orderDetailPoint, orderUrl, orderPrice } = params;

  const filterTakePoint = orderDetailPoint?.some(
    (e) => e.action === "Collect Points"
  );

  const [openCollect, setOpenCollect] = useState(false);

  const handleOpenCollect = () => {
    setOpenCollect(true);
    window.my_modal_CollectPoint.showModal();
  };

  const handleCloseCollect = () => {
    setOpenCollect(false);
  };

  return (
    <>
      <div className="flex justify-center pt-4">
        {filterTakePoint ? (
          <button className="btn btn-disabled">รับแต้มสะสมแล้ว</button>
        ) : (
          <button
            className="btn btn-success text-base-100"
            onClick={() => handleOpenCollect()}
          >
            รับแต้มสะสม
          </button>
        )}
      </div>

      <dialog id="my_modal_CollectPoint" className="modal">
        {openCollect && (
          <DialogCollectPoint
            orderId={orderId}
            handleCloseCollect={handleCloseCollect}
            orderPrice={orderPrice}
            orderUrl={orderUrl}
          />
        )}
      </dialog>
    </>
  );
}

function ByCassStatus(params) {
  const { status, userLanguage } = params;

  switch (status) {
    case "Payment":
      return (
        <>
          {userLanguage === "th" ? "อยู่ระหว่างรอการชำระเงิน" : "Wait Payment"}
        </>
      );

    case "Keep":
      return (
        <>
          {userLanguage === "th" ? "อยู่ระหว่างรอการชำระเงิน" : "Wait Payment"}
        </>
      );
    case "Making":
      return (
        <>
          {userLanguage === "th"
            ? "กำลังจัดเตรียมสินค้า"
            : "Preparing products"}
        </>
      );

    case "Receive":
      return (
        <>{userLanguage === "th" ? "พร้อมรับสินค้า" : "Receive Product"}</>
      );

    case "Success":
      return (
        <>
          {userLanguage === "th"
            ? "รับสินค้าแล้ว"
            : "Product has been received"}
        </>
      );

    case "Cancel":
      return (
        <>
          {userLanguage === "th" ? "คำสั่งซื้อถูกยกเลิก" : "Order has cancel"}
        </>
      );
    default:
      return (
        <>
          {userLanguage === "th"
            ? "อยู่ระหว่างการแก้ไข"
            : "In the process of being edited"}
        </>
      );
  }
}

const fetcherOrderSelect = (url) => axios.get(url).then((res) => res.data.res);
const getOrderDetail = (orderId, orderUrl) => {
  const { data, error, isLoading } = useSWR(orderUrl, fetcherOrderSelect, {
    revalidateOnFocus: false,
  });
  return {
    detailOrder: data,
    detailOrderLoading: isLoading,
    detailOrderError: error,
  };
};

const fetcherOrderAll = ([url, orderIds]) =>
  axios.post(url, orderIds).then((res) => res.data.res);
const getOrderDetailAll = (orderIds, orderUrl) => {
  const { data, error, isLoading } = useSWR(
    [orderUrl, orderIds],
    fetcherOrderAll(),
    {
      revalidateOnFocus: false,
    }
  );
  return {
    detailOrderAll: data,
    detailOrderAllLoading: isLoading,
    detailOrderAllError: error,
  };
};
