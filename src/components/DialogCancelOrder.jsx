import React, { useEffect, useState } from "react";
import ToastAlertSuccess from "./ToastAlertSuccess";
import ToastAlertError from "./ToastAlertError";
import { BaseURL, tokenRequest, updateStatusOrder } from "../service/BaseURL";
import axios from "axios";
import { mutate } from "swr";

export default function DialogCancelOrder(params) {
  const { openCancelOrder, setOpenCancelOrder, url } = params;

  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });
  const [onOpenToast, setOnOpenToast] = useState(false);

  const sendUpdateStatusOrder = async (ordId) => {
    const fetcherResOrder = async () => {
      let dataJson = JSON.stringify({
        orderId: ordId,
        status: "Cancel Order",
      });
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
        mutate(url);
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
      setOpenCancelOrder(false);
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, []);

  return (
    <>
      <div className="modal-box w-max">
        <form method="dialog">
          <button
            className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
            onClick={() => handleOnClose()}
          >
            ✕
          </button>
        </form>

        <div className="pt-2 form-control card">
          <span className="text-lg font-bold text-center label-text">
            ยืนยันยกเลิกออเดอร์
          </span>
          <div className="w-56 card-body"></div>
          {/* <aside className="my-2 card bg-neutral ">
              <aside className="py-2 card-body">
                <span className="text-center text-neutral-content">
                  แต้มสะสมของลูกค้า
                </span>
  
                <input
                  id="phoneCollect"
                  type="text"
                  placeholder="เบอร์โทรศัพท์"
                  maxLength={10}
                  className="h-10 input input-bordered"
                  value={phoneCollect.phoneNumber}
                  onChange={handleInputPhoneChange}
                />
  
                <div className="flex justify-between text-neutral-content">
                  <span>รับแต้มพื้นฐาน</span>
                  <span>
                    {shopSettingInfo
                      ? shopSettingInfo?.pointCollectRate *
                        openConfirmOrder.orderPrice
                      : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="w-[35%]  text-neutral-content">
                    รับแต้มเพิ่มเติม
                  </span>
                  <input
                    id="pointCollect"
                    type="text"
                    maxLength={7}
                    placeholder="0"
                    className="w-[25%] h-8 input input-bordered"
                    value={phoneCollect.collectMore}
                    onChange={handleInputCollectMoreChange}
                  />
                </div>
                <div className="flex justify-between pb-2 text-neutral-content">
                  <span>รวม</span>
                  <span>{phoneCollect.collectPoint}</span>
                </div>
              </aside>
            </aside> */}
        </div>

        <div className="mt-0 modal-action">
          {resUpdateStatusState.isLoadingUpdate ? (
            <button className="btn no-animation btn-active">
              <span className="loading loading-spinner loading-lg"></span>
            </button>
          ) : resUpdateStatusState.resUpdateOrder ? (
            <form method="dialog">
              <button
                className="btn btn-active"
                onClick={() => handleOnClose()}
              >
                สำเร็จ
              </button>
            </form>
          ) : (
            <button
              className="btn btn-active"
              onClick={() => sendUpdateStatusOrder(openCancelOrder.orderId)}
            >
              ยืนยัน
            </button>
          )}
        </div>
      </div>

      {/*  Toast   */}
      <>
        {onOpenToast &&
          (resUpdateStatusState.resUpdate ? (
            <ToastAlertSuccess
              setOnOpenToast={setOnOpenToast}
              successMessage={"Request success"}
            />
          ) : (
            <ToastAlertError
              setOnOpenToast={setOnOpenToast}
              errorMessage={
                resUpdateStatusState.errorUpdate
                  ? resUpdateStatusState.errorUpdate.message
                  : "Request fail"
              }
            />
          ))}
      </>
    </>
  );
}
