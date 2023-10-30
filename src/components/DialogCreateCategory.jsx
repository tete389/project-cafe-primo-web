import   { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { BaseURL, createCategory } from "../service/BaseURL";
import axios from "axios";
import ToastAlertError from "./ToastAlertError";
import ToastAlertSuccess from "./ToastAlertSuccess";

export default function DialogCreateCategory(params) {
  const { cateUrl, setOpenCreateCategory } = params;
  const { mutate } = useSWRConfig();

  const [onOpenToast, setOnOpenToast] = useState(false);
  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });

  const [dataCreateCate, setDataCreateCate] = useState({
    cateNameTh: "",
    cateNameEng: "",
  });

  const handleCateNmaeTh = (event) => {
    if (
      /^[ก-๏a-zA-Z0-9\s]+$/.test(event.target.value) ||
      event.target.value === ""
    ) {
      setDataCreateCate((prev) => ({
        ...prev,
        cateNameTh: event.target.value,
      }));
    }
  };

  const handleCateNmaeEng = (event) => {
    if (
      /^[ก-๏a-zA-Z0-9\s]+$/.test(event.target.value) ||
      event.target.value === ""
    ) {
      setDataCreateCate((prev) => ({
        ...prev,
        cateNameEng: event.target.value,
      }));
    }
  };

  //  send  create
  const sendCreateCate = async () => {
    if (!dataCreateCate.cateNameTh || !dataCreateCate.cateNameEng) {
      return;
    }

    const fetcherCreateCategory = async () => {
      let dataJson = JSON.stringify(dataCreateCate);
      const sendUrl = `${BaseURL}${createCategory}`;
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
        mutate(cateUrl);
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
    await fetcherCreateCategory();
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      setOpenCreateCategory(false);
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, []);

  return (
    <>
      <div className="p-0 modal-box bg-base-100">
        <form method="dialog">
          <button
            className="absolute btn btn-sm btn-circle right-2 top-2 btn-ghost "
            onClick={() => handleOnClose()}
          >
            ✕
          </button>
        </form>
        <div className="card-body">
          <h3 className="text-lg font-bold">สร้างหมวดหมู่สินค้า</h3>
          <div className="flex flex-wrap justify-between">
            <div className=" form-control">
              <label className="label" htmlFor="cateNameTh">
                <span className="label-text">
                  ชื่อสินค้าหมวดหมู่สินค้า - ไทย
                </span>
              </label>
              <input
                id="cateNameTh"
                type="text"
                value={dataCreateCate.cateNameTh}
                className="input input-bordered"
                onChange={handleCateNmaeTh}
              />
            </div>

            <div className=" form-control">
              <label className="label" htmlFor="cateNameEng">
                <span className="label-text">
                  ชื่อสินค้าหมวดหมู่สินค้า - อังกฤษ
                </span>
              </label>
              <input
                id="cateNameEng"
                type="text"
                value={dataCreateCate.cateNameEng}
                className=" input input-bordered"
                onChange={handleCateNmaeEng}
              />
            </div>
          </div>
          {resUpdateStatusState.isLoadingUpdate ? (
            <div className="mt-6 form-control">
              <button className="btn no-animation btn-active">
                <span className="loading loading-spinner loading-lg"></span>
              </button>
            </div>
          ) : resUpdateStatusState.resUpdate ? (
            <form method="dialog">
              <div className="mt-6 form-control">
                <button
                  className="btn btn-neutral"
                  onClick={() => handleOnClose()}
                >
                  สำเร็จ
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 form-control">
              <button
                className="btn btn-primary"
                onClick={() => sendCreateCate()}
              >
                สร้าง
              </button>
            </div>
          )}
        </div>
      </div>

      {/*  Toast   */}
      <>
        {onOpenToast &&
          (resUpdateStatusState.errorUpdate ? (
            <ToastAlertError
              setOnOpenToast={setOnOpenToast}
              errorMessage={"คำขอไม่สำเร็จ"}
            />
          ) : (
            resUpdateStatusState.resUpdate && (
              <ToastAlertSuccess
                setOnOpenToast={setOnOpenToast}
                successMessage={"คำขอสำเร็จ"}
              />
            )
          ))}
      </>
    </>
  );
}
