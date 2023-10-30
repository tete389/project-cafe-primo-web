import { useEffect, useState } from "react";
import { BaseURL, updateMaterial } from "../service/BaseURL";
import axios from "axios";
import ToastAlertError from "./ToastAlertError";
import ToastAlertSuccess from "./ToastAlertSuccess";
import ToastAlertLoading from "./ToastAlertLoading";

export default function DialogEditMaterial(params) {
  const { filterSelectMate, handleClearOpenMenuSelectDetail } = params;

  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });
  const [onOpenToast, setOnOpenToast] = useState(false);

  const [dataUpdateMate, setDataUpdateMate] = useState({
    mateName: "",
    mateUnit: "",
    mateId: filterSelectMate.mateId,
  });

  const handleMateName = (event) => {
    setDataUpdateMate((prev) => ({
      ...prev,
      mateName: event.target.value,
    }));
  };

  const handleMateUnit = (event) => {
    setDataUpdateMate((prev) => ({
      ...prev,
      mateUnit: event.target.value,
    }));
  };

  const sendUpdateMaterial = async () => {
    if (!dataUpdateMate.mateName && !dataUpdateMate.mateUnit) {
      return;
    }
    const fetcherUpdateMate = async () => {
      let dataJson = JSON.stringify(dataUpdateMate);
      const sendUrl = `${BaseURL}${updateMaterial}`;
     
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
        const response = await axios.put(sendUrl, dataJson, customConfig);
        const data = await response.data.res;
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: data,
          errorUpdate: "",
        }));
        filterSelectMate.mateName = data.mateName;
        filterSelectMate.mateUnit = data.mateUnit;
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
    await fetcherUpdateMate();
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      handleClearOpenMenuSelectDetail();
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, []);


  return (
    <>
      <div className="p-0 overflow-hidden h-maxl modal-box">
        <form method="dialog" className="p-2 bg-base-200">
          <p className="text-3xl font-bold">{filterSelectMate?.mateName}</p>
          <button
            className="absolute btn btn-sm btn-circle right-2 top-2"
            onClick={() => handleOnClose()}
          >
            ✕
          </button>
        </form>
        <div className="h-full px-0 pt-0 overflow-auto card-body scrollerBar">
          <div className="m-2 rounded-md bg-base-100">
            {filterSelectMate && (
              <div className="w-full card-body">
                <div className="flex flex-row justify-between">
                  <div className="form-control ">
                    <label className="label" htmlFor="mate-name">
                      <span className="label-text">
                        เปลี่ยนชื่อสินค้าคงคลัง
                      </span>
                    </label>
                    <input
                      id="mate-name"
                      type="text"
                      value={dataUpdateMate.mateName}
                      placeholder={filterSelectMate?.mateName}
                      className="input input-bordered"
                      onChange={handleMateName}
                    />
                  </div>

                  <div className="form-control ">
                    <label className="label" htmlFor="mate-unit">
                      <span className="label-text">เปลี่ยนหน่วย</span>
                    </label>
                    <input
                      id="mate-unit"
                      type="text"
                      value={dataUpdateMate.mateUnit}
                      placeholder={filterSelectMate?.mateUnit}
                      className="input input-bordered"
                      onChange={handleMateUnit}
                    />
                  </div>
                </div>
                <div className="justify-end pt-1 card-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => sendUpdateMaterial()}
                  >
                    บันทัก
                  </button>
                </div>
              </div>
            )}
          </div>
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
          ) : resUpdateStatusState.resUpdate ? (
            <ToastAlertSuccess
              setOnOpenToast={setOnOpenToast}
              successMessage={"คำขอสำเร็จ"}
            />
          ) : (
            <ToastAlertLoading />
          ))}
      </>
    </>
  );
}
