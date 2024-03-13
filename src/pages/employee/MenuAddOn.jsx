/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { BaseURL, deleteAddOn, findAddOnAll } from "../../service/BaseURL";
import ResLoadingScreen from "../../components/ResLoadingScreen";
import ResErrorScreen from "../../components/ResErrorScreen";
import TableMenuAddOn from "../../components/TableMenuAddOn";
import TableMenuAddOption from "../../components/TableMenuAddOption";
import DialogCreateAddOn from "../../components/DialogCreateAddOn";
import DialogEditAddOn from "../../components/DialogEditAddOn";
import DialogConfirmDelete from "../../components/DialogConfirmDelete";
import { useContext } from "react";
import { ToastAlertContext } from "./EmployeeLayout";

export default function MenuAddOn() {
  const addOnUrl = `${BaseURL}${findAddOnAll}`;
  const { resMenuAddOn, resLoading, resError } = getMenuAddOn(addOnUrl);
  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const [openCreateAddOn, setOpenCreateAddOn] = useState(false);

  const [openMenuAddOnDetail, setOpenMenuAddOnDetail] = useState({
    isOpen: false,
    addOnIdOpen: "",
    addOnTitleOpen: "",
    key: 0
  });

  const [openMenuOption, setOpenMenuOption] = useState({
    isOpen: false,
    addOnIdOpen: "",
    addOnTitleOpen: "",
  });

  const [openDeleteAddOn, setOpenDeleteAddOn] = useState({
    isOpen: false,
    addOnId: "",
  });

  const handleOpenMenuAddOnDetail = (addOnId, addOnTitle, key) => {
    setOpenMenuAddOnDetail({
      isOpen: true,
      addOnIdOpen: addOnId,
      addOnTitleOpen: addOnTitle,
      key: key
    });
  };

  const handleClearOpenMenuAddOnDetail = () => {
    setOpenMenuAddOnDetail({
      isOpen: false,
      addOnIdOpen: "",
      addOnNameOpen: "",
      key: 0
    });
  };

  const handleOpenMenuOption = (addOnId, addOnTitle) => {
    setOpenMenuOption({
      isOpen: true,
      addOnIdOpen: addOnId,
      addOnTitleOpen: addOnTitle,
    });
  };

  const handleClearOpenMenuOption = () => {
    setOpenMenuOption({
      isOpen: false,
      addOnIdOpen: "",
      addOnNameOpen: "",
    });
  };

  const handleOpenDeleteAddOn = (addOnId) => {
    setOpenDeleteAddOn({ isOpen: true, addOnId: addOnId });
    window.my_modal_DeleteAddOn.showModal();
  };

  const handleClearOpenDeleteAddOn = () => {
    setOpenDeleteAddOn({
      isOpen: false,
      addOnId: "",
    });
  };

  const sendDeleteAddOn = async (addId) => {
    const fetcherDeleteAddOn = async () => {
      let dataJson = JSON.stringify({
        addOnId: addId,
      });
      const sendUrl = `${BaseURL}${deleteAddOn}`;
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
        mutate(addOnUrl);
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

  const filterSelectAddOn = resMenuAddOn?.find((e) => {
    return (
      e.addOnId === openMenuAddOnDetail.addOnIdOpen ||
      e.addOnId === openMenuOption.addOnIdOpen
    );
  });

  return (
    <>
      <div className="flex flex-row items-center justify-between h-12 p-2 mt-1 rounded-t-md bg-base-200">
        <div className="overflow-auto text-2xl font-extrabold text-base-content breadcrumbs ">
          <ul>
            {openMenuOption.isOpen ? (
              <>
                <li onClick={handleClearOpenMenuOption}>
                  <a className="underline">รายการตัวเลือกสินค้า</a>
                </li>
                <li className="pr-2">{openMenuOption.addOnTitleOpen}</li>
              </>
            ) : (
              <li className="pr-2">รายการตัวเลือกสินค้า</li>
            )}
          </ul>
        </div>
      </div>

      {openMenuOption.isOpen ? (
        <div className={`h-full overflow-hidden rounded-b-md bg-base-200  `}>
          <TableMenuAddOption filterSelectAddOn={filterSelectAddOn} />
        </div>
      ) : (
        <></>
      )}

      <div
        className={`h-full overflow-hidden rounded-b-md bg-base-200  ${
          openMenuOption.isOpen && `hidden`
        } `}
      >
        <TableMenuAddOn
          resMenuAddOn={resMenuAddOn}
          handleOpenMenuAddOnDetail={handleOpenMenuAddOnDetail}
          handleOpenMenuOption={handleOpenMenuOption}
          setOpenCreateAddOn={setOpenCreateAddOn}
          handleOpenDeleteAddOn={handleOpenDeleteAddOn}
        />
      </div>

      {/*  Dialog   */}
      <>
        <dialog id="my_modal_CreateAddOn" className="modal">
          {openCreateAddOn && (
            <DialogCreateAddOn
              addOnUrl={addOnUrl}
              handleOpenMenuAddOnDetail={handleOpenMenuAddOnDetail}
              setOpenCreateAddOn={setOpenCreateAddOn}
            />
          )}
        </dialog>

        <dialog id="my_modal_EditAddOn" className="modal">
          {openMenuAddOnDetail.isOpen && (
            <DialogEditAddOn
            keyIndex={openMenuAddOnDetail.key}
              filterSelectAddOn={filterSelectAddOn}
              handleClearOpenMenuAddOnDetail={handleClearOpenMenuAddOnDetail}
            />
          )}
        </dialog>

        <dialog id="my_modal_DeleteAddOn" className="modal">
          {openDeleteAddOn.isOpen && (
            <DialogConfirmDelete
              sendDelete={sendDeleteAddOn}
              idDelete={openDeleteAddOn.addOnId}
              handleClearOpen={handleClearOpenDeleteAddOn}
            />
          )}
        </dialog>
      </>
    </>
  );
}

const fetcherMenu = (url) => axios.get(url).then((res) => res.data.res);
const getMenuAddOn = (url) => {
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
