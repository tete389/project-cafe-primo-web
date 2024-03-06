/* eslint-disable react-hooks/rules-of-hooks */
import useSWR, { mutate } from "swr";
import {
  BaseURL,
  deleteOption,
  findOptionByAddOnId,
  updateOption,
} from "../service/BaseURL";
import ResLoadingScreen from "./ResLoadingScreen";
import ResErrorScreen from "./ResErrorScreen";
import { ToastAlertContext } from "../pages/employee/EmployeeLayout";
import { useContext, useState } from "react";
import axios from "axios";
import DialogCreateOption from "./DialogCreateOption";
import DialogEditOption from "./DialogEditOption";
import DialogConfirmDelete from "./DialogConfirmDelete";

export default function TableMenuAddOption(params) {
  const { filterSelectAddOn } = params;
  const cateConnectUrl = `${BaseURL}${findOptionByAddOnId}${filterSelectAddOn?.addOnId}`;
  const {
    resMenuAddOn: resOption,
    resLoading,
    resError,
  } = getMenuAddOption(cateConnectUrl);

  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const [openOptionDetail, setOpenOptionDetail] = useState({
    optionId: "",
    isOpen: false,
    optionName: "",
  });

  const [openCreateOption, setOpenCreateOption] = useState(false);

  const [openDeleteOption, setOpenDeleteOption] = useState({
    isOpen: false,
    optionId: "",
  });

  const handleOpenOptionDetail = (optionId, optionName) => {
    setOpenOptionDetail({
      optionId: optionId,
      isOpen: true,
      optionName: optionName,
    });
  };

  const handleClearOpenOptionDetail = () => {
    setOpenOptionDetail({
      optionId: "",
      isOpen: false,
      optionName: "",
    });
  };

  const handleOpenDeleteOption = (optionId) => {
    setOpenDeleteOption({ isOpen: true, optionId: optionId });
    window.my_modal_DeleteOption.showModal();
  };

  const handleClearOpenDeleteOption = () => {
    setOpenDeleteOption({
      isOpen: false,
      optionId: "",
    });
  };

  const sendDeleteOption = async (optionId) => {
    const fetcherDeleteAddOn = async () => {
      let dataJson = JSON.stringify({
        optionId: optionId,
      });
      const sendUrl = `${BaseURL}${deleteOption}`;
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
      }
    };
    ////////// use
    await fetcherDeleteAddOn();
  };

  if (resLoading) {
    return <ResLoadingScreen />;
  }

  if (resError) {
    return <ResErrorScreen />;
  }
  const filterSelectOption = resOption?.find((e) => {
    return e.optionId === openOptionDetail.optionId;
  });

  return (
    <>
      <TaBleMenuOption
        resOption={resOption}
        setOpenCreateOption={setOpenCreateOption}
        handleOpenOptionDetail={handleOpenOptionDetail}
        handleOpenDeleteOption={handleOpenDeleteOption}
      />

      {/*  Dialog   */}
      <dialog id="my_modal_createOption" className="modal">
        {openCreateOption && (
          <DialogCreateOption
            addOnId={filterSelectAddOn?.addOnId}
            setOpenCreateOption={setOpenCreateOption}
            cateConnectUrl={cateConnectUrl}
          />
        )}
      </dialog>

      <dialog id="my_modal_EditOption" className="modal">
        {openOptionDetail.isOpen && (
          <DialogEditOption
            filterSelectOption={filterSelectOption}
            handleClearOpenOptionDetail={handleClearOpenOptionDetail}
          />
        )}
      </dialog>

      <dialog id="my_modal_DeleteOption" className="modal">
        {openDeleteOption.isOpen && (
          <DialogConfirmDelete
            sendDelete={sendDeleteOption}
            idDelete={openDeleteOption.optionId}
            handleClearOpen={handleClearOpenDeleteOption}
          />
        )}
      </dialog>
    </>
  );
}

function TaBleMenuOption(params) {
  const {
    resOption,
    handleOpenOptionDetail,
    setOpenCreateOption,
    handleOpenDeleteOption,
  } = params;

  const createOption = () => {
    setOpenCreateOption(true);
    window.my_modal_createOption.showModal();
  };
  return (
    <div className="h-full pb-0 overflow-auto scrollerBar">
      <table className="table table-pin-rows ">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th className="w-[25%]">ชื่อตัวเลือกย่อย</th>
            <th className="w-[25%] text-center">ราคา</th>
            <th className="w-[15%] text-center">สถานะ</th>
            <th className="px-1 text-end">
              <button
                className="btn btn-xs btn-outline btn-primary"
                onClick={() => createOption()}
              >
                เพิ่มตัวเลือกย่อย
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {resOption?.map((e, index) => (
            <TaBlePanalOption
              key={e.optionId}
              index={index}
              resOption={e}
              handleOpenOptionDetail={handleOpenOptionDetail}
              handleOpenDeleteOption={handleOpenDeleteOption}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TaBlePanalOption(params) {
  const { index, resOption, handleOpenOptionDetail, handleOpenDeleteOption } =
    params;

  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const handleDetail = () => {
    handleOpenOptionDetail(resOption.optionId, resOption.optionNameTh);
    window.my_modal_EditOption.showModal();
  };

  const sendUpdateStatusOption = async (optionId, isEnable) => {
    const fetcherUpdateAddOn = async () => {
      let dataJson = JSON.stringify({
        optionId: optionId,
        isEnable: !isEnable,
      });
      const sendUrl = `${BaseURL}${updateOption}`;
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
        resOption.isEnable = data.isEnable;
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
    await fetcherUpdateAddOn();
  };

  return (
    <tr className="hover bg-base-100">
      <th>{index + 1}</th>
      <td className="flex items-center justify-between">
        <div className="w-5/6">
          <p>{resOption.optionNameTh}</p>
          <p>{resOption.optionNameEng}</p>
        </div>
        
      </td>
      <th className="text-center">
        <p>{resOption.price}</p>
      </th>
      <th>
        {resOption?.isMaterialEnable ? (
          // <div className="form-control">
          <label
            className="px-0 cursor-pointer label"
            htmlFor={resOption.optionId}
          >
            <span className="label-text">
              {resOption.isEnable ? "เปิดขาย" : "ปิด"}
            </span>
            <input
              id={resOption.optionId}
              type="checkbox"
              className="toggle toggle-success toggle-sm"
              checked={resOption.isEnable}
              onChange={() =>
                sendUpdateStatusOption(resOption.optionId, resOption.isEnable)
              }
            />
          </label>
        ) : (
          // </div>
          <label
            className="px-0 cursor-pointer label"
            htmlFor={resOption.optionId}
          >
            <span className="label-text">ปิดโดยคงคลัง</span>
            <input
              id={resOption.optionId}
              type="checkbox"
              className="toggle toggle-sm"
              disabled
            />
          </label>
        )}
      </th>
      <th className="text-end">
      <div className="join">
      <button 
      className="btn btn-primary btn-sm text-base-100 join-item"
      onClick={() => handleDetail()}
      >
      <span>แก้ไข</span>
        </button>
        <button
          className="btn btn-error btn-sm text-base-100 join-item"
          onClick={() => handleOpenDeleteOption(resOption.optionId)}
        >
          <span>ลบ</span>
        </button>
        </div>
      </th>
    </tr>
  );
}

const fetcherMenu = (url) => axios.get(url).then((res) => res.data.res);
const getMenuAddOption = (url) => {
  const { data, error, isLoading, mutate } = useSWR(url, fetcherMenu, {
    revalidateOnFocus: false,
  });
  return {
    resMenuAddOn: data,
    resLoading: isLoading,
    resError: error,
    resMutate: mutate,
  };
};
