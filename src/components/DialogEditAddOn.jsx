import { useEffect, useState } from "react";
import { BaseURL, updateAddOn } from "../service/BaseURL";
import axios from "axios";
import ToastAlertError from "./ToastAlertError";
import ToastAlertSuccess from "./ToastAlertSuccess";
import ToastAlertLoading from "./ToastAlertLoading";

export default function DialogEditAddOn(params) {
  const { filterSelectAddOn, handleClearOpenMenuAddOnDetail } = params;

  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });
  const [onOpenToast, setOnOpenToast] = useState(false);

  const [dataUpdateAddOn, setDataUpdateAddOn] = useState({
    addOnTitleTh: "",
    addOnTitleEng: "",
    isManyOptions: filterSelectAddOn?.isManyOptions,
    addOnId: filterSelectAddOn?.addOnId,
  });

  const handleAddOnTitleTh = (event) => {
    setDataUpdateAddOn((prev) => ({
      ...prev,
      addOnTitleTh: event.target.value,
    }));
  };

  const handleAddOnTitleEng = (event) => {
    setDataUpdateAddOn((prev) => ({
      ...prev,
      addOnTitleEng: event.target.value,
    }));
  };

  const handleAddOnIsManyOptions = (event) => {
    setDataUpdateAddOn((prev) => ({
      ...prev,
      isManyOptions: event.target.checked,
    }));
  };

  const sendUpdateCategory = async () => {
    if (
      !dataUpdateAddOn.addOnTitleTh &&
      !dataUpdateAddOn.addOnTitleEng &&
      dataUpdateAddOn.isManyOptions === filterSelectAddOn?.isManyOptions
    ) {
      return;
    }
    const fetcherUpdateMate = async () => {
      let dataJson = JSON.stringify(dataUpdateAddOn);
      const sendUrl = `${BaseURL}${updateAddOn}`;

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
        filterSelectAddOn.addOnTitleTh = data.addOnTitleTh;
        filterSelectAddOn.addOnTitleTh = data.addOnTitleTh;
        filterSelectAddOn.isManyOptions = data.isManyOptions;
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
      handleClearOpenMenuAddOnDetail();
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, [timeToOut]);

  return (
    <>
      <div className="p-0 overflow-hidden h-max modal-box">
        <form method="dialog" className="p-2 bg-base-200">
          <p className="text-3xl font-bold">
            {filterSelectAddOn?.addOnTitleTh}
          </p>
          <button
            className="absolute btn btn-sm btn-circle right-2 top-2"
            onClick={() => handleOnClose()}
          >
            ✕
          </button>
        </form>
        <div className="h-full px-0 pt-0 overflow-auto card-body scrollerBar">
          <div className="m-2 rounded-md bg-base-100">
            {filterSelectAddOn && (
              <div className="w-full card-body">
                <div className="flex flex-row justify-between">
                  <div className="form-control ">
                    <label className="label" htmlFor="cate-name-th">
                      <span className="label-text">
                        เปลี่ยนชื่อตัวเลือกสินค้า - ไทย
                      </span>
                    </label>
                    <input
                      id="cate-name-th"
                      type="text"
                      value={dataUpdateAddOn.addOnTitleTh}
                      placeholder={filterSelectAddOn?.addOnTitleTh}
                      className="input input-bordered"
                      onChange={handleAddOnTitleTh}
                    />
                  </div>

                  <div className="form-control ">
                    <label className="label" htmlFor="cate-name-eng">
                      <span className="label-text">
                        เปลี่ยนชื่อตัวเลือกสินค้า - อังกฤษ
                      </span>
                    </label>
                    <input
                      id="cate-name-eng"
                      type="text"
                      value={dataUpdateAddOn.addOnTitleEng}
                      placeholder={filterSelectAddOn?.addOnTitleEng}
                      className="input input-bordered"
                      onChange={handleAddOnTitleEng}
                    />
                  </div>
                </div>

                <div className="justify-between pt-1 card-actions">
                  <div className="form-control">
                    <label
                      className="pt-0 cursor-pointer label"
                      htmlFor="cate-many-option"
                    >
                      <span className="label-text ">
                        เลือกได้หลายตัวเลือก :{" "}
                        {filterSelectAddOn.isManyOptions ? "เปิดอยู่" : "ปิด"}
                      </span>
                    </label>
                    <input
                      id="cate-many-option"
                      type="checkbox"
                      className="toggle toggle-success toggle-md"
                      checked={dataUpdateAddOn?.isManyOptions}
                      onChange={handleAddOnIsManyOptions}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => sendUpdateCategory()}
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
