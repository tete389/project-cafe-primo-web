import { useEffect } from "react";
import { useState } from "react";
import { BasketValueContext } from "../pages/Store";
import { useContext } from "react";
import { BaseURL, collectPoint } from "../service/BaseURL";
import ToastAlertError from "./ToastAlertError";
import ToastAlertSuccess from "./ToastAlertSuccess";
import axios from "axios";
import { mutate } from "swr";

export default function DialogCollectPoint(params) {
  const { orderId, handleCloseCollect, orderPrice, orderUrl } = params;

  const { setingShopData } = useContext(BasketValueContext);
  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });
  const [onOpenToast, setOnOpenToast] = useState(false);

  const [collect, setCollect] = useState({
    orderId: "",
    collectPoint: {
      phoneNumber: "",
      collectPoint: "",
    },
  });

  const handleInputPhoneChange = (event) => {
    if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
      setCollect((prev) => ({
        ...prev,
        collectPoint: {
          phoneNumber: event.target.value,
          collectPoint: prev.collectPoint.collectPoint,
        },
      }));
    }
  };

  // const handleInputCollectMoreChange = (event) => {
  //   if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
  //     setCollect(Number(event.target.value));
  //     setPhonePoint((prev) => ({
  //       ...prev,
  //       collectPoint:
  //         Number(shopSettingInfo?.pointCollectRate) *
  //           Number(dialogSelect.orderPrice) +
  //         Number(event.target.value),
  //       collectMore: Number(event.target.value),
  //     }));
  //   }
  // };

  const sendCollectPoint = async () => {
    const fetcherCreateProdBase = async () => {
      let dataJson = JSON.stringify(collect);
      const sendUrl = `${BaseURL}${collectPoint}`;
      setResUpdateStatusState((prev) => ({
        ...prev,
        isLoadingUpdate: true,
      }));
      let customConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const response = await axios.post(sendUrl, dataJson, customConfig);
        const data = await response.data.res;
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: data,
          errorUpdate: "",
        }));
        mutate(orderUrl);
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
    await fetcherCreateProdBase();
  };

  useEffect(() => {
    setCollect({
      orderId: orderId,
      collectPoint: {
        phoneNumber: "",
        collectPoint: setingShopData?.pointCollectRate * orderPrice,
        // collectMore: 0,
      },
    });
  }, [orderId, orderPrice, setingShopData?.pointCollectRate]);

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      handleCloseCollect();
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, [timeToOut]);

  ///
  return (
    <>
      <div className="p-0 modal-box bg-base-100">
        <form method="dialog">
          <button
            className="absolute btn btn-sm btn-circle right-2 top-2"
            onClick={() => handleOnClose()}
          >
            ✕
          </button>
        </form>
        <div className="card-body">
          <h3 className="text-lg font-bold">
            รับแต้มสะสม{" "}
            <span>{setingShopData?.pointCollectRate * orderPrice} แต้ม</span>
          </h3>
          <div className="flex flex-row flex-wrap items-center justify-around">
            <div className="form-control">
              <label className="label" htmlFor="phoneNumber">
                <span className="label-text">เบอร์โทรศัพท์</span>
              </label>
              <input
                id="phoneNumber"
                type="text"
                // className="input input-bordered"
                maxLength="10"
                className="w-40 text-center input input-bordered"
                value={collect.collectPoint.phoneNumber}
                onChange={handleInputPhoneChange}
              />
            </div>
            <div className="flex justify-end pt-5">
              {resUpdateStatusState.isLoadingUpdate ? (
                <button className="btn no-animation btn-active">
                  <span className="loading loading-spinner loading-lg"></span>
                </button>
              ) : resUpdateStatusState.resUpdate ? (
                <form method="dialog">
                  <button
                    className="btn btn-success"
                    onClick={() => handleOnClose()}
                  >
                    ปิด
                  </button>
                </form>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => sendCollectPoint()}
                >
                  รับแต้ม
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/*  Toast   */}
      <>
        {onOpenToast &&
          (resUpdateStatusState.errorUpdate ? (
            <ToastAlertError
              setOnOpenToast={setOnOpenToast}
              errorMessage={"รับแต้มไม่สำเร็จ"}
            />
          ) : (
            resUpdateStatusState.resUpdate && (
              <ToastAlertSuccess
                setOnOpenToast={setOnOpenToast}
                successMessage={"รับแต้มสำเร็จ"}
              />
            )
          ))}
      </>
    </>
  );
}

// const { phonePoint, setPhonePoint, shopSettingInfo, dialogSelect } = params;

// const [collect, setCollect] = useState("");

// const handleInputPhoneChange = (event) => {
//   if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
//     setPhonePoint((prev) => ({
//       ...prev,
//       phoneNumber: event.target.value,
//     }));
//   }
// };

// const handleInputCollectMoreChange = (event) => {
//   if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
//     setCollect(Number(event.target.value));
//     setPhonePoint((prev) => ({
//       ...prev,
//       collectPoint:
//         Number(shopSettingInfo?.pointCollectRate) *
//           Number(dialogSelect.orderPrice) +
//         Number(event.target.value),
//       collectMore: Number(event.target.value),
//     }));
//   }
// };

// useEffect(() => {
//   setPhonePoint({
//     phoneNumber: "",
//     collectPoint: shopSettingInfo?.pointCollectRate * dialogSelect.orderPrice,
//     collectMore: 0,
//   });
//   setCollect("");
// }, [dialogSelect]);

// return (
//   <>
//     {dialogSelect.nextStatus === "Success Order" && (
//       <div className="form-control">
//         <label className="label">
//           <span className="text-lg label-text">
//             {dialogSelect.dialogBody}
//           </span>
//         </label>
//         <aside className="mb-2 card bg-neutral ">
//           <aside className="py-2 card-body">
//             <label className="mt-3">
//               <input
//                 type="text"
//                 placeholder="เบอร์โทรศัพท์"
//                 maxLength={10}
//                 className="h-10 input input-bordered"
//                 value={phonePoint.phoneNumber}
//                 onChange={handleInputPhoneChange}
//               />
//             </label>
//             <div className="flex justify-between text-neutral-content">
//               <span>รับแต้มพื้นฐาน</span>
//               <span>
//                 {/* {phonePoint.collectPoint} */}
//                 {shopSettingInfo?.pointCollectRate * dialogSelect.orderPrice}
//               </span>
//             </div>
//             <label className="flex items-center justify-between">
//               <span className="w-[35%] bg-neutral text-neutral-content">
//                 รับแต้มเพิ่มเติม
//               </span>
//               <input
//                 type="text"
//                 maxLength={7}
//                 placeholder="0"
//                 className="w-[25%] h-8 input input-bordered"
//                 value={collect}
//                 onChange={handleInputCollectMoreChange}
//               />
//             </label>
//             <div className="flex justify-between pb-2 text-neutral-content">
//               <span>รวม</span>
//               <span>{phonePoint.collectPoint}</span>
//             </div>
//           </aside>
//         </aside>
//       </div>
//     )}
//   </>
// );
