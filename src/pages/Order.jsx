/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  BaseURL,
  dateEnd,
  dateStart,
  findRecentOrder,
  pageNum,
  pageSize,
  statusOrder,
} from "../service/BaseURL";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import TabPanel from "../components/TabPanel";
import { EmployeeContext } from "./employee/EmployeeLayout";
import { useContext } from "react";
import OrderDetail from "../components/OrderDetail";
import DialogConfirmOrder from "../components/DialogConfirmOrder";
import DialogConfirmPayment from "../components/DialogConfirmPayment";
import DialogCancelOrder from "../components/DialogCancelOrder";
import DialogSuccessOrder from "../components/DialogSuccessOrder";

export default function Order() {
  const tabsValue = [
    { tabName: "รอชำระ", tabStatus: "Payment" },
    { tabName: "กำลังทำ", tabStatus: "Making" },
    { tabName: "รอรับสินค้า", tabStatus: "Receive" },
    { tabName: "สำเร็จออเดอร์", tabStatus: "Success" },
    // { tabName: "ยกเลิก", tabStatus: "Cancel"},
  ];

  const [tabSelect, setTabSelect] = useState(0);
  const handleTabSelect = (newTab) => {
    setTabSelect(newTab);
  };

  return (
    <main className="pt-16">
      <div className="w-screen bg-base-100">
        <p className="pt-0 pb-1 text-2xl font-extrabold stat text-base-content">
          คำสั่งซื้อ
        </p>
      </div>
      <div className="flex-none overflow-y-hidden md:grow md:flex">
        <section className="container mx-auto overflow-hidden md:max-w-2xl lg:max-w-3xl xl:max-w-4xl ">
          <div className="tabs">
            {tabsValue?.map((e, index) => (
              <button
                key={e.tabStatus}
                className={`tab tab-lifted ${
                  tabSelect === index && `tab-active`
                }`}
                onClick={() => handleTabSelect(index)}
              >
                {/* {e.tabStatus === "Wait Payment" && notificationInfo !== "0" ? (
                  <div className="z- indicator">
                    <span className="indicator-item badge badge-primary">
                      {notificationInfo}
                    </span>
                    {e.tabName}
                  </div>
                ) : (
                  e.tabName
                )} */}
                {e.tabName}
              </button>
            ))}
          </div>
          <div className="h-screen overflow-auto scrollerBar pb-[170px]">
            {tabsValue?.map((e, index) => (
              <TabPanel value={tabSelect} index={index} key={index}>
                {tabSelect === index ? (
                  <TabBody tabStatus={e.tabStatus} index={index} />
                ) : (
                  <></>
                )}
              </TabPanel>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function TabBody(props) {
  const { tabStatus, index } = props;
  const { notifications } = useContext(EmployeeContext);

  const currentTh1 = new Date()
    .toLocaleString("en-US", {
      timeZone: "Asia/Bangkok",
    })
    .split(",")[0];
  const toDateTh1 = currentTh1.split("/");
  const dateTh1 = `${toDateTh1[2]}-${toDateTh1[0]}-${toDateTh1[1]}`;
  // const dateSt = `2023-10-01`;

  const url = `${BaseURL}${findRecentOrder}?${dateStart}${dateTh1}&${dateEnd}${dateTh1}&${statusOrder}${tabStatus}&${pageSize}30&${pageNum}0`;

  const { recentOrder, recentOrderLoading, recentOrdersError } =
    getRecentOrder(url);
  const { mutate } = useSWRConfig();

  const [orderSelect, setOrderSelect] = useState("");
  const [resUpdateStatusOrderState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
    openToast: false,
  });

  const [orderDialog, setOrderDialog] = useState({
    orderId: "",
    orderNumber: "",
    orderPrice: 0,
  });

  const [openSuccessOrder, setOpenSuccessOrder] = useState({
    open: false,
    orderId: "",
    orderNumber: "",
    orderPrice: 0,
  });

  const [openConfirmPayment, setOpenConfirmPayment] = useState({
    open: false,
    orderId: "",
    orderNumber: "",
    orderPrice: 0,
  });
  const [openConfirmOrder, setOpenConfirmOrder] = useState({
    open: false,
    orderId: "",
    orderNumber: "",
    orderPrice: 0,
  });

  const [openCancelOrder, setOpenCancelOrder] = useState({
    open: false,
    orderId: "",
  });

  const handleOrderSelect = (newTab) => {
    if (newTab === orderSelect) {
      setOrderSelect("");
    } else {
      setOrderSelect(newTab);
    }
  };

  const handleOpenConfirmOrder = (ordId, number, price) => {
    setOpenConfirmOrder({
      open: true,
      orderId: ordId,
      orderNumber: number,
      orderPrice: price,
    });
    window.my_modal_ConfirmOrder.showModal();
  };

  const handleOpenSuccessPayment = (ordId, number, price) => {
    setOpenConfirmPayment({
      open: true,
      orderId: ordId,
      orderNumber: number,
      orderPrice: price,
    });
    window.my_modal_ConfirmPayment.showModal();
  };

  const handleOpenSuccessOrder = (ordId, number, price) => {
    setOpenSuccessOrder({
      open: true,
      orderId: ordId,
      orderNumber: number,
      orderPrice: price,
    });
    window.my_modal_SuccessOrder.showModal();
  };

  const handleOpenCancelOrder = (ordId) => {
    setOpenCancelOrder({
      open: true,
      orderId: ordId,
    });
    window.my_modal_CancelOrder.showModal();
  };

  useEffect(() => {
    if (
      tabStatus === "Wait Payment" &&
      notifications?.countOrderNotPayment !== recentOrder?.length
    ) {
      mutate(url);
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

  // const sendUpdateStatusOrder = async (ordId) => {
  //   const fetcherResOrder = async () => {
  //     let dataJson = JSON.stringify({
  //       orderId: ordId,
  //       status: dialogSelect.nextStatus,
  //       collectPoint: phonePoint,
  //     });

  //     let customConfig = {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${tokenRequest}`,
  //       },
  //     };
  //     const sendUrl = `${BaseURL}${updateStatusOrder}`;
  //     setResUpdateStatusState((prev) => ({
  //       ...prev,
  //       isLoadingUpdateOrder: true,
  //     }));
  //     try {
  //       const response = await axios.put(sendUrl, dataJson, customConfig);
  //       const data = await response.data.res;
  //       setResUpdateStatusState((prev) => ({
  //         ...prev,
  //         resUpdateOrder: data,
  //       }));
  //     } catch (error) {
  //       console.error("error : ", error);
  //       setResUpdateStatusState({
  //         isLoadingUpdateOrder: false,
  //         errorUpdateOrder: error,
  //       });
  //     } finally {
  //       setResUpdateStatusState((prev) => ({
  //         ...prev,
  //         isLoadingUpdateOrder: false,
  //         openToast: true,
  //       }));
  //       mutate(url);
  //     }
  //   };
  //   ////////// use
  //   await fetcherResOrder();
  //   await toastAlertTimeOut();
  // };

  // const toastAlertTimeOut = async () => {
  //   setTimeout(() => {
  //     setResUpdateStatusState((prev) => ({
  //       ...prev,
  //       openToast: false,
  //     }));
  //   }, 2000);
  // };

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

  if (recentOrder && recentOrder.length) {
    return (
      <>
        <>
          {recentOrder?.map((e, index) => (
            <div key={index} className="w-full ">
              <div
                className={`w-full ${
                  index === 0 && `rounded-t-none`
                }  shadow-xl card bg-base-100`}
              >
                <div className="card-body">
                  <div className="flex flex-row justify-between card-title">
                    <span>Od-{e.orderNumber} </span>
                    <span>
                      {e.customerName === "none"
                        ? ""
                        : "ชื่อลูกค้า: " + e.customerName}{" "}
                    </span>
                    <span>เวลา {dateTime(e.orderDate)}</span>
                  </div>
                  <article
                    className={`flex  ${
                      orderSelect === e.orderId ? `flex-col` : `flex-row`
                    }`}
                  >
                    <div className="w-full overflow-x-auto bg-base-100">
                      <div className="p-0 m-0 collapse collapse-arrow join-item">
                        <input
                          type="checkbox"
                          name="my-accordion-4"
                          defaultValue={false}
                          checked={orderSelect === e.orderId}
                          onChange={() => handleOrderSelect(e.orderId)}
                          className="min-h-0 h-7"
                        />
                        <div className="min-h-0 p-0 m-0 text-xl font-medium h-7 collapse-title">
                          รายละเอียดสินค้า
                        </div>
                        <div className="p-0 m-0 collapse-content">
                          {orderSelect !== "" && orderSelect === e.orderId ? (
                            <OrderDetail orderSelect={orderSelect} />
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>

                    <section className="justify-end w-full card-actions">
                      <TabButtonByCase
                        tabStatus={tabStatus}
                        handleOpenConfirmOrder={handleOpenConfirmOrder}
                        handleOpenSuccessPayment={handleOpenSuccessPayment}
                        handleOpenCancelOrder={handleOpenCancelOrder}
                        handleOpenSuccessOrder={handleOpenSuccessOrder}
                        order={e}
                      />
                      {/* <ButtonBtTab
                        ordId={e.orderId}
                        ordNo={e.orderNumber}
                        ordPrice={e.orderPrice}
                        tabStatus={tabStatus}
                        setDialogSelect={setDialogSelect}
                        dialogSelect={dialogSelect}
                        resUpdateStatusOrderState={resUpdateStatusOrderState}
                      /> */}
                    </section>
                  </article>
                </div>
              </div>
              {recentOrder?.length - 1 !== index && (
                <div className="h-[1px]"></div>
              )}
            </div>
          ))}
        </>

        <dialog id="my_modal_ConfirmOrder" className="modal">
          {openConfirmOrder.open && (
            <DialogConfirmOrder
              openConfirmOrder={openConfirmOrder}
              setOpenConfirmOrder={setOpenConfirmOrder}
              url={url}
            />
          )}
        </dialog>

        <dialog id="my_modal_ConfirmPayment" className="modal">
          {openConfirmPayment.open && (
            <DialogConfirmPayment
              openConfirmPayment={openConfirmPayment}
              setOpenConfirmPayment={setOpenConfirmPayment}
              url={url}
            />
          )}
        </dialog>

        <dialog id="my_modal_SuccessOrder" className="modal">
          {openSuccessOrder.open && (
            <DialogSuccessOrder
              openSuccessOrder={openSuccessOrder}
              setOpenSuccessOrder={setOpenSuccessOrder}
              url={url}
            />
          )}
        </dialog>

        <dialog id="my_modal_CancelOrder" className="modal">
          {openCancelOrder.open && (
            <DialogCancelOrder
              openCancelOrder={openCancelOrder}
              setOpenCancelOrder={setOpenCancelOrder}
              url={url}
            />
          )}
        </dialog>
      </>
    );
  }

  if (!recentOrder) {
    return (
      <div className="items-center justify-center w-full bg-white rounded-t-none h-36 card">
        <span> โหลดข้อมูลล้มเหลว </span>
      </div>
    );
  }
}

function TabButtonByCase(params) {
  const {
    tabStatus,
    handleOpenConfirmOrder,
    handleOpenSuccessPayment,
    handleOpenCancelOrder,
    handleOpenSuccessOrder,
    order,
  } = params;
  switch (tabStatus) {
    case "Wait Payment":
      return (
        <ButtonTab1
          handleOpenSuccessPayment={handleOpenSuccessPayment}
          handleOpenCancelOrder={handleOpenCancelOrder}
          order={order}
        />
      );
    case "Success Payment":
      return (
        <ButtonTab2
          handleOpenConfirmOrder={handleOpenConfirmOrder}
          handleOpenCancelOrder={handleOpenCancelOrder}
          order={order}
        />
      );
    case "Success Order":
      return (
        <ButtonTab3
          handleOpenSuccessOrder={handleOpenSuccessOrder}
          handleOpenCancelOrder={handleOpenCancelOrder}
          order={order}
        />
      );
    default:
      return <></>;
  }
}

function ButtonTab3(params) {
  const { handleOpenSuccessOrder, handleOpenCancelOrder, order } = params;
  return (
    <>
      <button
        className="btn btn-neutral "
        onClick={() => {
          handleOpenSuccessOrder(
            order.orderId,
            order.orderNumber,
            order.orderPrice
          );
        }}
      >
        รับแต้ม
      </button>

      {/* <button
        className="btn-active btn"
        onClick={() => {
          handleOpenCancelOrder(order.orderId);
        }}
      >
        ยกเลิกออเดอร์
      </button> */}
    </>
  );
}

function ButtonTab2(params) {
  const { handleOpenConfirmOrder, handleOpenCancelOrder, order } = params;
  return (
    <>
      <button
        className="btn btn-neutral "
        onClick={() => {
          handleOpenConfirmOrder(
            order.orderId,
            order.orderNumber,
            order.orderPrice
          );
        }}
      >
        สำเร็จออเดอร์
      </button>

      <button
        className="btn-active btn"
        onClick={() => {
          handleOpenCancelOrder(order.orderId);
        }}
      >
        ยกเลิกออเดอร์
      </button>
    </>
  );
}

function ButtonTab1(params) {
  const { handleOpenSuccessPayment, handleOpenCancelOrder, order } = params;

  return (
    <>
      <button
        className="btn btn-neutral"
        onClick={() => {
          handleOpenSuccessPayment(
            order.orderId,
            order.orderNumber,
            order.orderPrice
          );
        }}
      >
        ชำระเงินสำเร็จ
      </button>

      <button
        className="btn-active btn"
        onClick={() => {
          handleOpenCancelOrder(order.orderId);
        }}
      >
        ยกเลิกออเดอร์
      </button>
    </>
  );
}

// function ButtonBtTab(props) {
//   const {
//     ordId,
//     ordNo,
//     ordPrice,
//     tabStatus,
//     setDialogSelect,
//     dialogSelect,
//     resUpdateStatusOrderState,
//   } = props;

//   switch (tabStatus) {
//     case "Success Payment":
//       return (
//         <>
//           {resUpdateStatusOrderState.isLoadingUpdateOrder &&
//           dialogSelect.orderId === ordId &&
//           dialogSelect.nextStatus === "Success Order" ? (
//             <button className="no-animation btn btn-neutral">
//               <span className="loading loading-spinner loading-sm"></span>
//               ออเดอร์สำเร็จ
//             </button>
//           ) : (
//             <button
//               className="btn btn-neutral "
//               disabled={resUpdateStatusOrderState.isLoadingUpdateOrder}
//               onClick={() => {
//                 window.my_modal_2.showModal();
//                 setDialogSelect({
//                   orderId: ordId,
//                   orderNumber: ordNo,
//                   nextStatus: "Success Order",
//                   dialogTitle: "ยืนยันการจ่ายสินค้า Od-" + ordNo,
//                   dialogBody:
//                     "กรอกหมายเลขโทรศัพท์เพื่อรับแต้มสะสม (ถ้าลูกค้าสะดวกรับ)",
//                   orderPrice: ordPrice,
//                 });
//               }}
//             >
//               ออเดอร์สำเร็จ
//             </button>
//           )}

//           {resUpdateStatusOrderState.isLoadingUpdateOrder &&
//           dialogSelect.orderId === ordId &&
//           dialogSelect.nextStatus === "Cancel Order" ? (
//             <button className="no-animation btn btn-active">
//               <span className="loading loading-spinner loading-sm"></span>
//               ออเดอร์สำเร็จ
//             </button>
//           ) : (
//             <button
//               className="btn-active btn"
//               disabled={resUpdateStatusOrderState.isLoadingUpdateOrder}
//               onClick={() => {
//                 window.my_modal_2.showModal();
//                 setDialogSelect({
//                   orderId: ordId,
//                   orderNumber: ordNo,
//                   nextStatus: "Cancel Order",
//                   dialogTitle: "ยกเลิกการสั่ง Od-" + ordNo,
//                   dialogBody: "คุณต้องการยกเลิกออเดอร์แล้วหรือไม่",
//                   orderPrice: 0,
//                 });
//               }}
//             >
//               ยกเลิกออเดอร์
//             </button>
//           )}
//         </>
//       );
//     case "Wait Payment":
//       return (
//         <>
//           {resUpdateStatusOrderState.isLoadingUpdateOrder &&
//           dialogSelect.orderId === ordId &&
//           dialogSelect.nextStatus === "Success Payment" ? (
//             <button className="no-animation btn btn-neutral">
//               <span className="loading loading-spinner loading-sm"></span>
//               ชำระเงินสำเร็จ
//             </button>
//           ) : (
//             <button
//               className="btn btn-neutral"
//               disabled={resUpdateStatusOrderState.isLoadingUpdateOrder}
//               onClick={() => {
//                 window.my_modal_2.showModal();
//                 setDialogSelect({
//                   orderId: ordId,
//                   orderNumber: ordNo,
//                   nextStatus: "Success Payment",
//                   dialogTitle: "ยืนยันการชำระเงิน Od-" + ordNo,
//                   dialogBody: "ลูกค้าได้ทำการชำระเงินของออเดอร์แล้วหรือไม่",
//                   orderPrice: 0,
//                 });
//               }}
//             >
//               ชำระเงินสำเร็จ
//             </button>
//           )}

//           {resUpdateStatusOrderState.isLoadingUpdateOrder &&
//           dialogSelect.orderId === ordId &&
//           dialogSelect.nextStatus === "Cancel Order" ? (
//             <button className="no-animation btn btn-active">
//               <span className="loading loading-spinner loading-sm"></span>
//               ยกเลิกออเดอร์
//             </button>
//           ) : (
//             <button
//               className="btn-active btn"
//               disabled={resUpdateStatusOrderState.isLoadingUpdateOrder}
//               onClick={() => {
//                 window.my_modal_2.showModal();
//                 setDialogSelect({
//                   orderId: ordId,
//                   orderNumber: ordNo,
//                   nextStatus: "Cancel Order",
//                   dialogTitle: "ยกเลิกการสั่ง Od-" + ordNo,
//                   dialogBody: "คุณต้องการยกเลิกออเดอร์แล้วหรือไม่",
//                   orderPrice: 0,
//                 });
//               }}
//             >
//               ยกเลิกออเดอร์
//             </button>
//           )}
//         </>
//       );
//     default:
//       return <></>;
//   }
// }

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
