import { useEffect } from "react";
import { useState } from "react";
import { BaseURL, tokenRequest, updateStatusOrder } from "../service/BaseURL";
import axios from "axios";
import { mutate } from "swr";
import { useContext } from "react";
import { EmployeeContext } from "../pages/employee/EmployeeLayout";
import ToastAlertError from "./ToastAlertError";
import ToastAlertSuccess from "./ToastAlertSuccess";

export default function DialogSuccessOrder(params) {
  const { openSuccessOrder, setOpenSuccessOrder, url } = params;
  const { shopSettingInfo } = useContext(EmployeeContext);

  const [phoneCollect, setPhoneCollect] = useState({
    phoneNumber: "",
    collectPoint: shopSettingInfo
      ? shopSettingInfo?.pointCollectRate * openSuccessOrder.orderPrice
      : 0,
    collectMore: "",
  });
  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });
  const [onOpenToast, setOnOpenToast] = useState(false);

  const handleInputPhoneChange = (event) => {
    if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
      setPhoneCollect((prev) => ({
        ...prev,
        phoneNumber: event.target.value,
      }));
    }
  };

  const handleInputCollectMoreChange = (event) => {
    if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
      setPhoneCollect((prev) => ({
        ...prev,
        collectPoint:
          Number(shopSettingInfo?.pointCollectRate) *
            Number(openSuccessOrder.orderPrice) +
          Number(event.target.value),
        collectMore: event.target.value,
      }));
    }
  };

  const sendUpdateStatusOrder = async (ordId, collect) => {
    const fetcherResOrder = async () => {
      let dataJson;
      if (collect.phoneNumber) {
        dataJson = JSON.stringify({
          orderId: ordId,
          status: "Success Order",
          collectPoint: collect,
        });
      } else {
        dataJson = JSON.stringify({
          orderId: ordId,
          status: "Success Order",
        });
      }
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
          errorUpdate: error,
          resUpdate: "",
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
        setOpenSuccessOrder({
        open: false,
        orderId: "",
        orderNumber: "",
        orderPrice: 0,
      });
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, []);

  return (
    <>
      <div className="w-full modal-box">
        <form method="dialog">
          <button
            className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
            onClick={() => handleOnClose()}
          >
            ✕
          </button>
        </form>

        <div className="form-control">
          <span className="text-lg font-bold text-center label-text">
             รับแต้มสะสม
          </span>

          <aside className="my-2 card bg-neutral ">
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
                      openSuccessOrder.orderPrice
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
                  className="w-[25%] h-8 input input-bordered text-end"
                  value={phoneCollect.collectMore}
                  onChange={handleInputCollectMoreChange}
                />
              </div>
              <div className="flex justify-between pb-2 text-neutral-content">
                <span>รวม</span>
                <span>{phoneCollect.collectPoint}</span>
              </div>
            </aside>
          </aside>
        </div>

        <div className="mt-0 modal-action">
          {resUpdateStatusState.isLoadingUpdate ? (
            <button className="btn no-animation btn-active">
              <span className="loading loading-spinner loading-lg"></span>
            </button>
          ) : resUpdateStatusState.resUpdate ? (
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
              onClick={() =>
                sendUpdateStatusOrder(openSuccessOrder.orderId, phoneCollect)
              }
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
