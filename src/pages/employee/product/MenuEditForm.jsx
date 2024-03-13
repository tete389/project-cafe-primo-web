/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
// import ResLoadingScreen from "./ResLoadingScreen";
// import ResErrorScreen from "./ResErrorScreen";
// import ToastAlertError from "./ToastAlertError";
// import ToastAlertSuccess from "./ToastAlertSuccess";
// import ToastAlertLoading from "./ToastAlertLoading";

import axios from "axios";
import useSWR, { mutate, useSWRConfig } from "swr";
// import DialogAddMoreAddOnPanal from "./DialogAddMoreAddOnPanal";
// import DialogAddMaterialUse from "./DialogAddMaterialUse";
import {
  BaseURL,
  createMaterialUsed,
  deleteFromProductForm,
  deleteMaterialUsed,
  findProductFormById,
  haveAddOn,
  haveMateUse,
  updateProductForm,
} from "../../../service/BaseURL";
import ResLoadingScreen from "../../../components/ResLoadingScreen";
import ResErrorScreen from "../../../components/ResErrorScreen";
import ToastAlertError from "../../../components/ToastAlertError";
import ToastAlertSuccess from "../../../components/ToastAlertSuccess";
import ToastAlertLoading from "../../../components/ToastAlertLoading";
import DialogAddMoreAddOnPanal from "../../../components/DialogAddMoreAddOnPanal";
import DialogAddMaterialUse from "../../../components/DialogAddMaterialUse";
import DialogEditMaterialUse from "../../../components/DialogEditMaterialUse";

export default function MenuEditForm(params) {
  const {
    sendDeleteForm,
    urlDetailBase,
    filterSelectProdForm,
    handleClearOpenFormDetail,
    setOpenDeleteForm,
  } = params;

  const urlDetail = `${BaseURL}${findProductFormById}${filterSelectProdForm?.prodFormId}&${haveAddOn}&${haveMateUse}`;
  const { resFormDetail, resLoading, resError } = getFormDetail(urlDetail);

  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });
  const [onOpenToast, setOnOpenToast] = useState(false);

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      handleClearOpenFormDetail();
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, [timeToOut]);

  if (resLoading) {
    return (
      <>
        <div className="card-body">
          <ResLoadingScreen />
        </div>
      </>
    );
  }

  if (resError) {
    return (
      <>
        <div className="card-body">
          <ResErrorScreen />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full h-full px-0 pt-0 overflow-auto card-body scrollerBar">
        <div className="m-2 rounded-md bg-base-100">
          {filterSelectProdForm && (
            <EditPanel
              sendDeleteForm={sendDeleteForm}
              urlDetailBase={urlDetailBase}
              filterSelectProdForm={filterSelectProdForm}
              setOnOpenToast={setOnOpenToast}
              setResUpdateStatusState={setResUpdateStatusState}
              setOpenDeleteForm={setOpenDeleteForm}
            />
          )}
        </div>
        <div className="m-2 rounded-md bg-base-200">
          {resFormDetail && (
            <AddOnPanel
              resFormDetail={resFormDetail}
              urlDetail={urlDetail}
              setOnOpenToast={setOnOpenToast}
              setResUpdateStatusState={setResUpdateStatusState}
            />
          )}
        </div>

        <div className="m-2 mb-10 rounded-md bg-base-200">
          {resFormDetail && (
            <AddMaterialPanel
              resFormDetail={resFormDetail}
              urlDetail={urlDetail}
              setOnOpenToast={setOnOpenToast}
              setResUpdateStatusState={setResUpdateStatusState}
            />
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

function EditPanel(params) {
  const {
    urlDetailBase,
    filterSelectProdForm,
    setOnOpenToast,
    setResUpdateStatusState,
    setOpenDeleteForm,
  } = params;

  // const { setOnOpenToast, setResUpdateStatusState } =
  //   useContext(ToastAlertContext);

  const [dataUpdateForm, setDataUpdateForm] = useState({
    prodFormTh: "",
    prodFormEng: "",
    price: "",
    description: "",
    prodFormId: filterSelectProdForm.prodFormId,
  });

  const handleFormNameTh = (event) => {
    setDataUpdateForm((prev) => ({
      ...prev,
      prodFormTh: event.target.value,
    }));
  };

  const handleFormNameEng = (event) => {
    setDataUpdateForm((prev) => ({
      ...prev,
      prodFormEng: event.target.value,
    }));
  };

  const handleFormPrice = (event) => {
    if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
      setDataUpdateForm((prev) => ({
        ...prev,
        price: Number(event.target.value),
      }));
    }
  };

  // const handleFormDescription = (event) => {
  //   setDataUpdateForm((prev) => ({
  //     ...prev,
  //     description: event.target.value,
  //   }));
  // };

  //  send  update
  const sendUpdateForm = async () => {
    const fetcherUpdateForm = async () => {
      let dataJson = JSON.stringify(dataUpdateForm);
      const sendUrl = `${BaseURL}${updateProductForm}`;
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
        filterSelectProdForm.prodFormTh = data.prodFormTh;
        filterSelectProdForm.prodFormEng = data.prodFormEng;
        filterSelectProdForm.price = data.price;
        setDataUpdateForm({
          prodFormTh: "",
          prodFormEng: "",
          price: "",
          description: "",
          prodFormId: filterSelectProdForm.prodFormId,
        });
        mutate(urlDetailBase);
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
    await fetcherUpdateForm();
  };

  const deleteFormProduct = (formId) => {
    setOpenDeleteForm({ isOpen: true, prodFormId: formId });
    window.my_modal_DeleteForm.showModal();
  };

  const sendUpdateStatusForm = async (formId, isEnable) => {
    const fetcherUpdateForm = async () => {
      let dataJson = JSON.stringify({
        prodFormId: formId,
        isEnable: !isEnable,
      });

      const sendUrl = `${BaseURL}${updateProductForm}`;
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
        // mutate(urlDetail);
        filterSelectProdForm.isEnable = data.isEnable;
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
    await fetcherUpdateForm();
  };

  useEffect(() => {
    setDataUpdateForm({
      prodFormTh: "",
      prodFormEng: "",
      price: "",
      description: "",
      prodFormId: filterSelectProdForm.prodFormId,
    });
  }, [filterSelectProdForm]);
  return (
    <div className="w-full card-body">
      <div className="flex flex-row flex-wrap justify-between">
        <div className="form-control ">
          <label className="label" htmlFor="text-form-nameTh">
            <span className="label-text">เปลี่ยนชื่อรูปแบบ - ไทย</span>
          </label>
          <input
            id="text-form-nameTh"
            type="text"
            value={dataUpdateForm.prodFormTh}
            placeholder={filterSelectProdForm?.prodFormTh}
            className="input input-bordered"
            onChange={handleFormNameTh}
          />
        </div>

        <div className="form-control ">
          <label className="label" htmlFor="text-form-nameEng">
            <span className="label-text">เปลี่ยนชื่อรูปแบบ - อังกฤษ</span>
          </label>
          <input
            id="text-form-nameEng"
            type="text"
            value={dataUpdateForm.prodFormEng}
            placeholder={filterSelectProdForm?.prodFormEng}
            className="input input-bordered"
            onChange={handleFormNameEng}
          />
        </div>

        <div className="form-control ">
          <label className="label" htmlFor="text-price">
            <span className="label-text">เปลี่ยนราคา</span>
          </label>
          <input
            id="text-price"
            type="text"
            maxLength={6}
            value={dataUpdateForm.price}
            placeholder={filterSelectProdForm?.price}
            className="input input-bordered"
            onChange={handleFormPrice}
          />
        </div>
      </div>
      {/* <div className="form-control">
          <label className="label" htmlFor="text-discription">
            <span className="label-text">คำอธิบาย</span>
          </label>
          <textarea
            id="text-discription"
            value={dataUpdateForm.description}
            placeholder={resFormDetail?.description}
            className="textarea textarea-bordered"
            onChange={handleFormDescription}
          ></textarea>
        </div> */}
      <div className="justify-between pt-1 card-actions">
        <div >
          {filterSelectProdForm?.isMaterialEnable ? (
            // <div className="form-control">
            <label
              className="px-0 cursor-pointer label"
              htmlFor={filterSelectProdForm.prodFormId}
            >
              <span className="label-text">
                {filterSelectProdForm.isEnable ? "เปิดขาย" : "ปิด"}
              </span>
              <input
                id={filterSelectProdForm.prodFormId}
                type="checkbox"
                className="toggle toggle-success toggle-sm"
                checked={filterSelectProdForm.isEnable}
                onChange={() =>
                  sendUpdateStatusForm(
                    filterSelectProdForm.prodFormId,
                    filterSelectProdForm.isEnable
                  )
                }
              />
            </label>
          ) : (
            // </div>
            <label
              className="px-0 label"
              htmlFor={filterSelectProdForm.prodFormId}
            >
              <span className="label-text">ปิดโดยคงคลัง</span>
              <input
                id={filterSelectProdForm.prodFormId}
                type="checkbox"
                className="toggle toggle-sm"
                disabled
              />
            </label>
          )}
        </div>

        <div className="justify-between w-[20%] flex">
          <button className=" btn btn-primary" onClick={() => sendUpdateForm()}>
            บันทัก
          </button>
           
          <button
            className="btn btn-error"
            onClick={() => deleteFormProduct(filterSelectProdForm?.prodFormId)}
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  );
}

function AddOnPanel(params) {
  const { resFormDetail, urlDetail, setOnOpenToast, setResUpdateStatusState } =
    params;

  const { mutate } = useSWRConfig();

  const [openAddMoreAddOn, setOpenAddMoreAddOn] = useState(false);

  const addMoreAddOn = () => {
    setOpenAddMoreAddOn(true);
    window.my_modal_addMoreAddOn.showModal();
  };

  //  send  update addOn
  const sendDeleteAddOnForm = async (formId, addOnId) => {
    // const newAddOn = resFormDetail?.addOn?.filter((el) => {
    //   if (el.addOnId !== addOnId) {
    //     return {
    //       addOnId: el.addOnId,
    //     };
    //   }
    // });
    const deleteAddon = [
      {
        addOnId: addOnId,
      },
    ];

    const fetcherDeleteAddOn = async () => {
      let dataJson = JSON.stringify({
        prodFormId: formId,
        addOn: deleteAddon,
      });

      const sendUrl = `${BaseURL}${deleteFromProductForm}`;
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
    await fetcherDeleteAddOn();
  };
  return (
    <div className="card-body">
      <div className="flex justify-between">
        <span className="font-bold">ตัวเลือก</span>
        <button
          className="btn btn-xs btn-outline btn-primary"
          onClick={() => addMoreAddOn()}
        >
          เพิ่มตัวเลือก
        </button>
      </div>

      <div>
        {resFormDetail?.addOn?.map((e) => (
          <div key={e.addOnId} className="p-2 join min-w-max ">
            <span className="join-item badge badge-ghost badge-lg bg-base-100">
              {e.addOnTitleTh}
            </span>
            <button
              className="join-item btn btn-xs bg-base-100"
              onClick={() =>
                sendDeleteAddOnForm(resFormDetail.prodFormId, e.addOnId)
              }
            >
              <box-icon name="x-circle"></box-icon>
            </button>
          </div>
        ))}
      </div>
      <dialog id="my_modal_addMoreAddOn" className="modal">
        {openAddMoreAddOn && (
          <DialogAddMoreAddOnPanal
            resAddOn={resFormDetail?.addOn}
            prodFormId={resFormDetail?.prodFormId}
            setOpenAddMoreAddOn={setOpenAddMoreAddOn}
            urlDetail={urlDetail}
            setResUpdateStatusState={setResUpdateStatusState}
            setOnOpenToast={setOnOpenToast}
          />
        )}
      </dialog>
    </div>
  );
}

function AddMaterialPanel(params) {
  const { resFormDetail, urlDetail, setOnOpenToast, setResUpdateStatusState } =
    params;

  const { mutate } = useSWRConfig();
  const [openAddMaterailUse, setOpenAddMaterailUse] = useState(false);
  const [openEditMaterailUse, setOpenEditMaterailUse] = useState(false);

  const openAdd = () => {
    setOpenAddMaterailUse(true);
    window.my_modal_addMaterialUse.showModal();
  };

  const closeAdd = () => {
    setOpenAddMaterailUse(false);
    window.my_modal_addMaterialUse.close();
  };

  const openEdit = () => {
    setOpenEditMaterailUse(true);
    window.my_modal_editMaterialUse.showModal();
  };

  const closeEdit = () => {
    setOpenEditMaterailUse(false);
    window.my_modal_editMaterialUse.close();
  };

  const sendDeleteMaterialUsed = async (prodFormId, mateId) => {
    // const newMate = resFormDetail.materialUsed?.filter((el) => {
    //   if (el.mateId !== mateId) {
    //     return {
    //       mateId: el.mateId,

    //     };
    //   }
    // });
    const deleteMateUse = [
      {
        mateId: mateId,
      },
    ];
    const fetcherDelMateUse = async () => {
      let dataJson = JSON.stringify({
        prodFormId: prodFormId,
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
  const sendUpdateProdFormMateUsed = async (prodFormId, mateCheck) => {
    const result = mateCheck.filter((e) => {
      return e.useCount;
    });
    if (result.length <= 0) {
      // handleOnClose();
      return;
    }
    const fetcherUpdateFormBaseMateUsed = async () => {
      let dataJson = JSON.stringify({
        prodFormId: prodFormId,
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
        closeEdit();
      }
    };
    ////////// use
    await fetcherUpdateFormBaseMateUsed();
  };

  return (
    <>
      <div className="card-body">
        <div className="flex justify-between">
          <span className="font-bold">ส่วนผสม</span>
          <button
            className="btn btn-xs btn-outline btn-secondary"
            onClick={() => openEdit()}
          >
            แก้ไขส่วนผสม
          </button>
          <button
            className="btn btn-xs btn-outline btn-primary"
            onClick={() => openAdd()}
          >
            เพิ่มส่วนผสม
          </button>
        </div>

        <div>
          {resFormDetail.materialUsed?.map((e) => (
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
                  sendDeleteMaterialUsed(resFormDetail.prodFormId, e.mateId)
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
            idIsUsed={resFormDetail.prodFormId}
            materialUse={resFormDetail.materialUsed}
            closeAdd={closeAdd}
            sendUpdateMateUsed={sendUpdateProdFormMateUsed}
          />
        )}
      </dialog>

      <dialog id="my_modal_editMaterialUse" className="modal">
        {openEditMaterailUse && (
          <DialogEditMaterialUse
            idIsUsed={resFormDetail.prodFormId}
            materialUse={resFormDetail.materialUsed}
            closeEdit={closeEdit}
            sendUpdateMateUsed={sendUpdateProdFormMateUsed}
          />
        )}
      </dialog>
    </>
  );
}

const fetcherFormDetail = (url) => axios.get(url).then((res) => res.data.res);
const getFormDetail = (url) => {
  const { data, error, isLoading, mutate } = useSWR(url, fetcherFormDetail, {
    revalidateOnFocus: false,
  });
  return {
    resFormDetail: data,
    resLoading: isLoading,
    resError: error,
    resMutate: mutate,
  };
};
