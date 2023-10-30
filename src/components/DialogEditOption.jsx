/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import { useEffect, useState } from "react";
import {
  BaseURL,
  createMaterialUsed,
  deleteMaterialUsed,
  findMaterialUseByOptionId,
  updateOption,
} from "../service/BaseURL";

import ToastAlertError from "./ToastAlertError";
import ToastAlertSuccess from "./ToastAlertSuccess";
import ToastAlertLoading from "./ToastAlertLoading";
import DialogAddMaterialUse from "./DialogAddMaterialUse";
import useSWR, { useSWRConfig } from "swr";
import ResLoadingScreen from "./ResLoadingScreen";
import ResErrorScreen from "./ResErrorScreen";

export default function DialogEditOption(params) {
  const { filterSelectOption, handleClearOpenOptionDetail } = params;

  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });

  const [onOpenToast, setOnOpenToast] = useState(false);

  const [dataUpdateOption, setDataUpdateOption] = useState({
    optionNameTh: "",
    optionNameEng: "",
    price: "",
    optionId: filterSelectOption?.optionId,
  });

  const handleOptionNameTh = (event) => {
    setDataUpdateOption((prev) => ({
      ...prev,
      optionNameTh: event.target.value,
    }));
  };

  const handleOptionNameEng = (event) => {
    setDataUpdateOption((prev) => ({
      ...prev,
      optionNameEng: event.target.value,
    }));
  };

  const handleOptionPrice = (event) => {
    setDataUpdateOption((prev) => ({
      ...prev,
      price: event.target.value,
    }));
  };

  const sendUpdateOption = async () => {
    if (
      !dataUpdateOption.optionNameTh &&
      !dataUpdateOption.optionNameEng &&
      !dataUpdateOption.price
    ) {
      return;
    }
    const fetcherUpdateMate = async () => {
      let dataJson = JSON.stringify(dataUpdateOption);
      const sendUrl = `${BaseURL}${updateOption}`;

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
        filterSelectOption.optionNameTh = data.optionNameTh;
        filterSelectOption.optionNameEng = data.optionNameEng;
        filterSelectOption.price = data.price;
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
      handleClearOpenOptionDetail();
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
            {filterSelectOption?.optionNameTh}
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
            {filterSelectOption && (
              <>
                <div className="w-full card-body">
                  <div className="flex flex-row flex-wrap justify-between">
                    <div className="form-control ">
                      <label className="label" htmlFor="option-name-th">
                        <span className="label-text">
                          เปลี่ยนชื่อตัวเลือกเสริม - ไทย
                        </span>
                      </label>
                      <input
                        id="option-name-th"
                        type="text"
                        value={dataUpdateOption.optionNameTh}
                        placeholder={filterSelectOption?.optionNameTh}
                        className="input input-bordered"
                        onChange={handleOptionNameTh}
                      />
                    </div>

                    <div className="form-control ">
                      <label className="label" htmlFor="option-name-eng">
                        <span className="label-text">
                          เปลี่ยนชื่อตัวเลือกเสริม - อังกฤษ
                        </span>
                      </label>
                      <input
                        id="option-name-eng"
                        type="text"
                        value={dataUpdateOption.optionNameEng}
                        placeholder={filterSelectOption?.optionNameEng}
                        className="input input-bordered"
                        onChange={handleOptionNameEng}
                      />
                    </div>

                    <div className="form-control ">
                      <label className="label" htmlFor="option-price">
                        <span className="label-text">ราคา</span>
                      </label>
                      <input
                        id="option-price"
                        type="text"
                        value={dataUpdateOption.price}
                        placeholder={filterSelectOption?.price}
                        className="input input-bordered"
                        onChange={handleOptionPrice}
                      />
                    </div>
                  </div>

                  <div className="justify-end pt-1 card-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => sendUpdateOption()}
                    >
                      บันทัก
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="m-2 mb-10 rounded-md bg-base-200">
              {filterSelectOption && (
                <AddMaterialPanel
                  optionId={filterSelectOption?.optionId}
                 
                  setOnOpenToast={setOnOpenToast}
                  setResUpdateStatusState={setResUpdateStatusState}
                />
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

function AddMaterialPanel(params) {
  const {
    optionId,

    setOnOpenToast,
    setResUpdateStatusState,
  } = params;

  const urlDetail = `${BaseURL}${findMaterialUseByOptionId}${optionId}`;
  const { resMenuMaterial, resLoading, resError } = getMenuMaterial(urlDetail);

  const { mutate } = useSWRConfig();
  const [openAddMaterailUse, setOpenAddMaterailUse] = useState(false);

  const openAdd = () => {
    setOpenAddMaterailUse(true);
    window.my_modal_addMaterialUse.showModal();
  };

  const closeAdd = () => {
    setOpenAddMaterailUse(false);
    window.my_modal_addMaterialUse.close();
  };

  const sendDeleteMaterialUsed = async (optionId, mateId) => {
    const deleteMateUse = [
      {
        mateId: mateId,
      },
    ];
    const fetcherDelMateUse = async () => {
      let dataJson = JSON.stringify({
        optionId: optionId,
        mateUsed: deleteMateUse,
      });
      const sendUrl = `${BaseURL}${deleteMaterialUsed}`;
      setOnOpenToast(true);
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
        mutate(urlDetail);
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
      }
    };
    ////////// use
    await fetcherDelMateUse();
  };

  // update
  const sendUpdateProdBaseMateUsed = async (optionId, mateCheck) => {
    const result = mateCheck.filter((e) => {
      return e.useCount;
    });
    if (result.length <= 0) {
      // handleOnClose();
      return;
    }
    const fetcherUpdateProdBaseMateUsed = async () => {
      let dataJson = JSON.stringify({
        optionId: optionId,
        mateUsed: result,
      });
      const sendUrl = `${BaseURL}${createMaterialUsed}`;
      setOnOpenToast(true);
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
        mutate(urlDetail);
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
        closeAdd();
      }
    };
    ////////// use
    await fetcherUpdateProdBaseMateUsed();
  };

  if (resLoading) {
    return <ResLoadingScreen />;
  }

  if (resError) {
    return <ResErrorScreen />;
  }

  return (
    <>
      <div className="card-body">
        <div className="flex justify-between">
          <span className="font-bold">ส่วนผสม</span>
          <button
            className="btn btn-xs btn-outline btn-primary"
            onClick={() => openAdd()}
          >
            เพิ่มส่วนผสม
          </button>
        </div>
        <div>
          {resMenuMaterial?.map((e) => (
            <div key={e.mateId} className="px-2 pt-3 join">
              <span className="join-item badge badge-ghost badge-lg bg-base-100">
                {e.mateName}
              </span>
              <span className="join-item badge badge-ghost badge-lg bg-base-100">
                {e.amountUsed} {e.mateUnit}
              </span>
              <button
                className="join-item btn btn-xs bg-base-100"
                onClick={() =>
                  sendDeleteMaterialUsed(optionId, e.mateId)
                }
              >
                <box-icon name="x-circle"></box-icon>
              </button>
            </div>
          ))}
        </div>
      </div>

      <dialog id="my_modal_addMaterialUse" className="modal">
        {openAddMaterailUse && (
          <DialogAddMaterialUse
            idIsUsed={optionId}
            materialUse={resMenuMaterial}
            closeAdd={closeAdd}
            sendUpdateMateUsed={sendUpdateProdBaseMateUsed}
          />
        )}
      </dialog>
    </>
  );
}

const fetcherMenuMaterial = (url) => axios.get(url).then((res) => res.data.res);
const getMenuMaterial = (url) => {
  const { data, error, isLoading, mutate } = useSWR(url, fetcherMenuMaterial, {
    revalidateOnFocus: false,
  });
  return {
    resMenuMaterial: data,
    resLoading: isLoading,
    resError: error,
    resMutate: mutate,
  };
};
