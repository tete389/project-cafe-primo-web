import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import ToastAlertError from "./ToastAlertError";
import ToastAlertSuccess from "./ToastAlertSuccess";
import { BaseURL, createMaterial } from "../service/BaseURL";
import axios from "axios";

export default function DialogCreateMaterail(params) {
  const { mateUrl, setOpenCreateMaterial } = params;
  const { mutate } = useSWRConfig();

  const [onOpenToast, setOnOpenToast] = useState(false);
  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });

  const [dataCreateMate, setDataCreateMate] = useState({
    mateName: "",
    stock: "",
    mateUnit: "",
  });

  const handleMateNmae = (event) => {
    if (/^[ก-๏a-zA-Z0-9\s]+$/.test(event.target.value) || event.target.value === "") {
      setDataCreateMate((prev) => ({ ...prev, mateName: event.target.value }));
    }
  };

  const handleMateUnit = (event) => {
    if (
      /^[ก-๏a-zA-Z0-9]+$/.test(event.target.value) ||
      event.target.value === ""
    ) {
      setDataCreateMate((prev) => ({ ...prev, mateUnit: event.target.value }));
    }
  };

  const handleMateStock = (event) => {
    if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
      setDataCreateMate((prev) => ({ ...prev, stock: event.target.value }));
    }
  };

  //  send  create
  const sendCreateMate = async () => {
    const fetcherCreateMaterial = async () => {
      let dataJson = JSON.stringify(dataCreateMate);
      const sendUrl = `${BaseURL}${createMaterial}`;
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
        mutate(mateUrl);
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
    await fetcherCreateMaterial();
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      setOpenCreateMaterial(false);
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
          <h3 className="text-lg font-bold">สร้างสินค้าคงคลัง</h3>
          <div className="flex flex-wrap justify-between">
            <div className=" form-control">
              <label className="label" htmlFor="mateName">
                <span className="label-text">ชื่อสินค้าคงคลัง</span>
              </label>
              <input
                id="mateName"
                type="text"
                value={dataCreateMate.mateName}
                className="input input-bordered"
                onChange={handleMateNmae}
              />
            </div>

            <div className=" form-control">
              <label className="label" htmlFor="mateUnit">
                <span className="label-text">หน่วย</span>
              </label>
              <input
                id="mateUnit"
                type="text"
                value={dataCreateMate.mateUnit}
                className=" input input-bordered"
                onChange={handleMateUnit}
              />
            </div>

            <div className=" form-control">
              <label className="label" htmlFor="mateStock">
                <span className="label-text">จำนวนตั้งต้น</span>
              </label>
              <input
                id="mateStock"
                type="text"
                value={dataCreateMate.stock}
                className="input input-bordered"
                onChange={handleMateStock}
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
                onClick={() => sendCreateMate()}
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
