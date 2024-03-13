import axios from "axios";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { BaseURL, createAddOn } from "../service/BaseURL";
import ToastAlertError from "./ToastAlertError";
import ToastAlertSuccess from "./ToastAlertSuccess";

export default function DialogCreateAddOn(params) {
  const { addOnUrl, handleOpenMenuAddOnDetail, setOpenCreateAddOn } = params;
  const { mutate } = useSWRConfig();

  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });
  const [onOpenToast, setOnOpenToast] = useState(false);
  const [dataCreatAddOn, setDataCreateAddOn] = useState({
    addOnTitleTh: "",
    addOnTitleEng: "",
    isManyOptions: false,
  });

  const handleAddOnTitleTh = (event) => {
    if (/^[ก-๏0-9\s]+$/.test(event.target.value) || event.target.value === "") {
      setDataCreateAddOn((prev) => ({
        ...prev,
        addOnTitleTh: event.target.value,
      }));
    }
  };

  const handleAddOTitleEng = (event) => {
    if (
      /^[a-zA-Z0-9\s]+$/.test(event.target.value) ||
      event.target.value === ""
    ) {
      setDataCreateAddOn((prev) => ({
        ...prev,
        addOnTitleEng: event.target.value,
      }));
    }
  };

  const handleAddOnManyOption = (event) => {
    setDataCreateAddOn((prev) => ({
      ...prev,
      isManyOptions: event.target.checked,
    }));
  };

  //  send  create
  const sendCreateAddOn = async () => {
    const fetcherCreateAddOn = async () => {
      let dataJson = JSON.stringify(dataCreatAddOn);
      const sendUrl = `${BaseURL}${createAddOn}`;
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
        await mutate(addOnUrl);
        setDataCreateAddOn({
          addOnTitleTh: "",
          addOnTitleEng: "",
          isManyOptions: false,
        });
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
    await fetcherCreateAddOn();
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      setOpenCreateAddOn(false);
    }, 200);
  };

  const handleOnCloseToDetail = () => {
    timeToOut = setTimeout(() => {
      setOpenCreateAddOn(false);
      handleOpenMenuAddOnDetail(
        resUpdateStatusState.resUpdate.addOnId,
        resUpdateStatusState.resUpdate.addOnTitleTh,
        1
      );
      setResUpdateStatusState({
        resUpdate: "",
        errorUpdate: "",
        isLoadingUpdate: false,
      });
      window.my_modal_EditAddOn.showModal();
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, [timeToOut]);

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
          <h3 className="text-lg font-bold">สร้างตัวเลือกสินค้า</h3>
          <div className="flex flex-wrap justify-between">
            <div className="form-control">
              <label className="label" htmlFor="addTitleTh">
                <span className="label-text">ชื่อตัวเลือกสินค้า - ไทย</span>
              </label>
              <input
                id="addTitleTh"
                type="text"
                value={dataCreatAddOn.addOnTitleTh}
                className="input input-bordered"
                onChange={handleAddOnTitleTh}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="addTitleEng">
                <span className="label-text">ชื่อตัวเลือกสินค้า - อังกฤษ</span>
              </label>
              <input
                id="addTitleEng"
                type="text"
                value={dataCreatAddOn.addOnTitleEng}
                className="input input-bordered"
                onChange={handleAddOTitleEng}
              />
            </div>
            <div className="pt-2 form-control">
              <label
                className="pt-0 cursor-pointer label"
                htmlFor="addManyOption"
              >
                <span className="label-text ">
                  เลือกได้หลายตัวเลือก :{" "}
                  {dataCreatAddOn.isManyOptions ? "ใช่" : "ไม่"}
                </span>
              </label>
              <input
                id="addManyOption"
                type="checkbox"
                className="toggle toggle-success toggle-md"
                checked={dataCreatAddOn.isManyOptions}
                onChange={handleAddOnManyOption}
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
                  onClick={() => handleOnCloseToDetail()}
                >
                  สำเร็จ
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 form-control">
              <button
                className="btn btn-primary"
                onClick={() => sendCreateAddOn()}
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
