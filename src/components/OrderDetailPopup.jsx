/* eslint-disable react-hooks/rules-of-hooks */
import {
  BaseURL,
  findOrderById,
  haveOrderDetail,
  updateStatusOrder,
} from "../service/BaseURL";
import axios from "axios";
import useSWR, { mutate } from "swr";
import ResLoadingScreen from "./ResLoadingScreen";
import ResErrorScreen from "./ResErrorScreen";
import { ToastAlertContext } from "../pages/employee/EmployeeLayout";
import { useContext, useEffect } from "react";

export default function OrderDetailPopup(params) {
  const { handleOpenOrderDetail, id, OrderUrl } = params;

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
          <button
            className=" btn btn-circle btn-link"
            onClick={() => handleOpenOrderDetail(false, "")}
          >
            <box-icon
              name="x"
              color="hsl(var(--bc) / var(--tw-text-opacity))"
            ></box-icon>
          </button>
          <p className="text-2xl stat-value">
            <ByCassStatus status={detailOrder?.status} />
          </p>
          <p className="w-10"></p>
        </div>
      </header>

      <main className="flex flex-col h-full overflow-y-scroll pb-[16rem] bg-base-300 pt-2 scrollerBar">
        <div className="mx-2 mb-4 shadow-md card bg-base-100 text-base-content">
          <div className="card-body ">
            <p className="card-title">
              เลขออเดอร์: Od-{detailOrder?.orderNumber}
            </p>
            <div>
              <ReportDetail detailOrder={detailOrder} />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full gap-4 px-2">
          <TabButtonByCase
            tabStatus={detailOrder?.status}
            orderId={id}
            handleOpenOrderDetail={handleOpenOrderDetail}
            OrderUrl={OrderUrl}
          />
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
              <div className="flex justify-between text-xl font-bold">
                <p>ชื่อลูกค้า</p>
                <p className="text-end">{detailOrder?.customerName}</p>
              </div>
            )}

          {detailOrder?.note &&
            detailOrder?.note != "None" &&
            detailOrder?.note != "none" && (
              <p className="pt-1 stat-title">ข้อความ : {detailOrder?.note}</p>
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

            <p className="text-end">เวลา {manageTime(detailOrder.orderDate)}</p>
          </div>
          {/* <div className="flex flex-wrap">
            <p>สถานะออเดอร์</p>
            <ByCassStatus status={detailOrder.status} />
          </div> */}
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
      return <></>;
  }
}

function TabButtonByCase(params) {
  const { tabStatus, orderId, handleOpenOrderDetail, OrderUrl } = params;
  switch (tabStatus) {
    case "Payment":
      return (
        <ButtonTabPayment
          orderId={orderId}
          handleOpenOrderDetail={handleOpenOrderDetail}
          OrderUrl={OrderUrl}
        />
      );
    case "Making":
      return (
        <ButtonTabMaking
          orderId={orderId}
          handleOpenOrderDetail={handleOpenOrderDetail}
          OrderUrl={OrderUrl}
        />
      );
    case "Receive":
      return (
        <ButtonTabReceive
          orderId={orderId}
          handleOpenOrderDetail={handleOpenOrderDetail}
          OrderUrl={OrderUrl}
        />
      );
    case "Keep":
      return (
        <ButtonTabKeep
          orderId={orderId}
          handleOpenOrderDetail={handleOpenOrderDetail}
          OrderUrl={OrderUrl}
        />
      );
    default:
      return <></>;
  }
}

function ButtonTabKeep(params) {
  const { orderId, handleOpenOrderDetail, OrderUrl } = params;

  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const sendUpdateStatusOrder = async (ordId, statusAction) => {
    let dataJson = JSON.stringify({
      orderId: ordId,
      status: statusAction,
    });
    const fetcherResOrder = async () => {
      const isLogin = JSON.parse(localStorage.getItem("loggedIn")) || false;
      let customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isLogin?.accessToken}`,
        },
      };
      const sendUrl = `${BaseURL}${updateStatusOrder}`;
      setResUpdateStatusState((prev) => ({
        ...prev,
        isLoadingUpdate: true,
      }));
      try {
        const response = await axios.put(sendUrl, dataJson, customConfig);
        const data = await response.data.res;
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: data,
          errorUpdate: "",
        }));
        mutate(OrderUrl);
        handleOnClose();
      } catch (error) {
        console.error("error : ", error);
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: "",
          errorUpdate: error,
        }));
      } finally {
        setResUpdateStatusState((prev) => ({
          ...prev,
          isLoadingUpdate: false,
        }));
        setOnOpenToast(true);
      }
    };
    ////////// use
    await fetcherResOrder();
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      handleOpenOrderDetail(false, "");
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, [timeToOut]);

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => {
          sendUpdateStatusOrder(orderId, "Payment");
        }}
      >
        ย้อนกลับรอชำระ
      </button>
      <div className="flex justify-end">
        <button
          className="w-[49%] btn  "
          onClick={() => {
            sendUpdateStatusOrder(orderId, "Cancel");
          }}
        >
          ยกเลิกออเดอร์
        </button>
      </div>
    </>
  );
}

function ButtonTabReceive(params) {
  const { orderId, handleOpenOrderDetail, OrderUrl } = params;

  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const sendUpdateStatusOrder = async (ordId, statusAction) => {
    let dataJson;
    if (statusAction) {
      dataJson = JSON.stringify({
        orderId: ordId,
        status: statusAction,
      });
    } else {
      dataJson = JSON.stringify({
        orderId: ordId,
      });
    }
    const fetcherResOrder = async () => {
      const isLogin = JSON.parse(localStorage.getItem("loggedIn")) || false;
      let customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isLogin?.accessToken}`,
        },
      };
      const sendUrl = `${BaseURL}${updateStatusOrder}`;
      setResUpdateStatusState((prev) => ({
        ...prev,
        isLoadingUpdate: true,
      }));
      try {
        const response = await axios.put(sendUrl, dataJson, customConfig);
        const data = await response.data.res;
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: data,
          errorUpdate: "",
        }));
        mutate(OrderUrl);
        handleOnClose();
      } catch (error) {
        console.error("error : ", error);
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: "",
          errorUpdate: error,
        }));
      } finally {
        setResUpdateStatusState((prev) => ({
          ...prev,
          isLoadingUpdate: false,
        }));
        setOnOpenToast(true);
      }
    };
    ////////// use
    await fetcherResOrder();
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      handleOpenOrderDetail(false, "");
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, [timeToOut]);

  return (
    <>
      <button
        className="btn btn-success text-base-100"
        onClick={() => {
          sendUpdateStatusOrder(orderId, "Success");
        }}
      >
        สำเร็จออเดอร์
      </button>
      <div className="flex justify-end">
        <button
          className="w-[49%] btn "
          onClick={() => {
            sendUpdateStatusOrder(orderId, "Cancel");
          }}
        >
          ยกเลิกออเดอร์
        </button>
      </div>
    </>
  );
}

function ButtonTabMaking(params) {
  const { orderId, handleOpenOrderDetail, OrderUrl } = params;

  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const sendUpdateStatusOrder = async (ordId, statusAction) => {
    let dataJson;
    if (statusAction) {
      dataJson = JSON.stringify({
        orderId: ordId,
        status: statusAction,
      });
    } else {
      dataJson = JSON.stringify({
        orderId: ordId,
      });
    }

    const fetcherResOrder = async () => {
      const isLogin = JSON.parse(localStorage.getItem("loggedIn")) || false;
      let customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isLogin?.accessToken}`,
        },
      };
      const sendUrl = `${BaseURL}${updateStatusOrder}`;
      setResUpdateStatusState((prev) => ({
        ...prev,
        isLoadingUpdate: true,
      }));
      try {
        const response = await axios.put(sendUrl, dataJson, customConfig);
        const data = await response.data.res;
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: data,
          errorUpdate: "",
        }));
        mutate(OrderUrl);
        handleOnClose();
      } catch (error) {
        console.error("error : ", error);
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: "",
          errorUpdate: error,
        }));
      } finally {
        setResUpdateStatusState((prev) => ({
          ...prev,
          isLoadingUpdate: false,
        }));
        setOnOpenToast(true);
      }
    };
    ////////// use
    await fetcherResOrder();
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      handleOpenOrderDetail(false, "");
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, [timeToOut]);

  return (
    <>
      <button
        className="btn btn-warning text-base-100 "
        onClick={() => {
          sendUpdateStatusOrder(orderId, "");
        }}
      >
        เตรียมสินค้าสำเร็จ
      </button>
      <div className="flex justify-between">
        <button
          className="w-[49%] btn btn-success text-base-100"
          onClick={() => {
            sendUpdateStatusOrder(orderId, "Success");
          }}
        >
          สำเร็จออเดอร์ทันที
        </button>
        <button
          className="w-[49%] btn btn-primary"
          onClick={() => {
            sendUpdateStatusOrder(orderId, "Payment");
          }}
        >
          ย้อนกลับรอชำระ
        </button>
      </div>
      <div className="flex justify-end">
        <button
          className="w-[49%] btn "
          onClick={() => {
            sendUpdateStatusOrder(orderId, "Cancel");
          }}
        >
          ยกเลิกออเดอร์
        </button>
      </div>
    </>
  );
}

function ButtonTabPayment(params) {
  const { orderId, handleOpenOrderDetail, OrderUrl } = params;

  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const sendUpdateStatusOrder = async (ordId, statusAction) => {
    let dataJson;
    if (statusAction) {
      dataJson = JSON.stringify({
        orderId: ordId,
        status: statusAction,
      });
    } else {
      dataJson = JSON.stringify({
        orderId: ordId,
      });
    }
    const fetcherResOrder = async () => {
      const isLogin = JSON.parse(localStorage.getItem("loggedIn")) || false;
      let customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isLogin?.accessToken}`,
        },
      };
      const sendUrl = `${BaseURL}${updateStatusOrder}`;
      setResUpdateStatusState((prev) => ({
        ...prev,
        isLoadingUpdate: true,
      }));
      try {
        const response = await axios.put(sendUrl, dataJson, customConfig);
        const data = await response.data.res;
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: data,
          errorUpdate: "",
        }));
        mutate(OrderUrl);
        handleOnClose();
      } catch (error) {
        console.error("error : ", error);
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: "",
          errorUpdate: error,
        }));
      } finally {
        setResUpdateStatusState((prev) => ({
          ...prev,
          isLoadingUpdate: false,
        }));
        setOnOpenToast(true);
      }
    };
    ////////// use
    await fetcherResOrder();
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      handleOpenOrderDetail(false, "");
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, [timeToOut]);

  return (
    <>
      <button
        className="btn btn-info text-base-100"
        onClick={() => {
          sendUpdateStatusOrder(orderId, "");
        }}
      >
        ยืนยันชำระเงิน
      </button>
      <div className="flex justify-between">
        <button
          className="w-[49%] btn btn-success  text-base-100"
          onClick={() => {
            sendUpdateStatusOrder(orderId, "Success");
          }}
        >
          สำเร็จออเดอร์ทันที
        </button>
        <button
          className="w-[49%] btn btn-neutral "
          onClick={() => {
            sendUpdateStatusOrder(orderId, "Keep");
          }}
        >
          จัดการภายหลัง
        </button>
      </div>
      <div className="flex justify-end">
        {/* <button
          className="w-[49%] btn btn-success"
          onClick={() => {
            sendUpdateStatusOrder(orderId, "Success");
          }}
        >
          สำเร็จออเดอร์ทันที
        </button> */}
        <button
          className="w-[49%] btn"
          onClick={() => {
            sendUpdateStatusOrder(orderId, "Cancel");
          }}
        >
          ยกเลิกออเดอร์
        </button>
      </div>
    </>
  );
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
