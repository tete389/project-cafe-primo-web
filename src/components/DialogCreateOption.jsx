import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { BaseURL, createOption } from "../service/BaseURL";
import axios from "axios";
import ToastAlertSuccess from "./ToastAlertSuccess";
import ToastAlertError from "./ToastAlertError";

export default function DialogCreateOption(params) {
  const { addOnId, setOpenCreateOption, cateConnectUrl } = params;
  const [resUpdateStatusOrderState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });
  const { mutate } = useSWRConfig();

  const [dataCreateOption, setDataCreateOption] = useState({
    optionNameTh: "",
    optionNameEng: "",
    price: "",
    addOnId: addOnId,
  });
  const [onOpenToast, setOnOpenToast] = useState(false);

  const handleOptionTh = (event) => {
    setDataCreateOption((prev) => ({
      ...prev,
      optionNameTh: event.target.value,
    }));
  };

  const handleOptionEng = (event) => {
    setDataCreateOption((prev) => ({
      ...prev,
      optionNameEng: event.target.value,
    }));
  };

  const handleOptionPrice = (event) => {
    if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
      setDataCreateOption((prev) => ({
        ...prev,
        price: Number(event.target.value),
      }));
    }
  };

  //  send  create
  const sendCreateForm = async () => {
    const fetcherUpdateProd = async () => {
      let dataJson = JSON.stringify(dataCreateOption);
      const sendUrl = `${BaseURL}${createOption}`;
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
        mutate(cateConnectUrl);
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
    await fetcherUpdateProd();
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      setOpenCreateOption(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeToOut);
    };
  }, [timeToOut]);

  return (
    <>
      <div className="p-0 modal-box bg-base-100">
        <form method="dialog">
          <button
            className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
            onClick={() => handleOnClose()}
          >
            ✕
          </button>
        </form>
        <div className="card-body">
          <h3 className="text-lg font-bold">เพิ่มตัวเลือกย่อย</h3>
          <div className="flex flex-wrap justify-between">
            <div className="form-control">
              <label className="label" htmlFor="optionNameTh">
                <span className="label-text">ชื่อตัวเลือกย่อย - ไทย</span>
              </label>
              <input
                id="optionNameTh"
                type="text"
                value={dataCreateOption.optionNameTh}
                className="input input-bordered"
                onChange={handleOptionTh}
              />
            </div>

            <div className="form-control ">
              <label className="label" htmlFor="optionNameEng">
                <span className="label-text">ชื่อตัวเลือกย่อย - อังกฤษ</span>
              </label>
              <input
                id="optionNameEng"
                type="text"
                value={dataCreateOption.optionNameEng}
                className="input input-bordered"
                onChange={handleOptionEng}
              />
            </div>

            <div className="form-control ">
              <label className="label" htmlFor="price">
                <span className="label-text">ราคา</span>
              </label>
              <input
                id="price"
                type="text"
                maxLength={6}
                value={dataCreateOption.price}
                className="input input-bordered"
                onChange={handleOptionPrice}
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            {resUpdateStatusOrderState.isLoadingUpdate ? (
              <button className="w-full btn no-animation btn-active">
                <span className="loading loading-spinner loading-lg"></span>
              </button>
            ) : resUpdateStatusOrderState.resUpdate ? (
              <form method="dialog" className="w-full">
                <button
                  className="w-full btn btn-neutral"
                  onClick={() => handleOnClose()}
                >
                  สำเร็จ
                </button>
              </form>
            ) : (
              <button
                className="w-full btn btn-primary "
                onClick={() => sendCreateForm()}
              >
                สร้าง
              </button>
            )}
          </div>
        </div>
        {/* </div> */}
      </div>

      {/*  Toast   */}
      <>
        {onOpenToast &&
          (resUpdateStatusOrderState.resUpdate ? (
            <ToastAlertSuccess
              setOnOpenToast={setOnOpenToast}
              successMessage={"Request success"}
            />
          ) : (
            <ToastAlertError
              setOnOpenToast={setOnOpenToast}
              errorMessage={resUpdateStatusOrderState.errorUpdate.message}
            />
          ))}
      </>
    </>
  );
}
