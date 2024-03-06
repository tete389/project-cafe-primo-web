/* eslint-disable react-hooks/rules-of-hooks */
import {
  BaseURL,
  deleteProductForm,
  findProductFormByBaseId,
  updateProductForm,
} from "../service/BaseURL";
import { useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import DialogCreateFormPanal from "./DialogCreateFormPanal";
import { useContext } from "react";
import { ToastAlertContext } from "../pages/employee/EmployeeLayout";
import ResLoadingScreen from "./ResLoadingScreen";
import ResErrorScreen from "./ResErrorScreen";
import DialogEditFormProd from "./DialogEditFormProd";
import DialogConfirmDelete from "./DialogConfirmDelete";

export default function TableMenuForm(params) {
  const { prodId } = params;

  const urlDetail = `${BaseURL}${findProductFormByBaseId}${prodId}`;
  const { resForm, resLoading, resError } = getProductDetail(urlDetail);

  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openDeleteForm, setOpenDeleteForm] = useState({
    isOpen: false,
    prodFormId: "",
  });

  const [openFormDetail, setOpenFormDetail] = useState({
    isOpen: false,
    formId: "",
    formName: "",
  });

  const handleOpenFormDetail = (formId, formName) => {
    setOpenFormDetail({
      isOpen: true,
      formId: formId,
      formName: formName,
    });
  };

  const handleClearOpenFormDetail = () => {
    setOpenFormDetail({
      isOpen: false,
      formId: "",
      formName: "",
    });
  };

  const handleClearOpenDeleteForm = () => {
    setOpenDeleteForm({
      isOpen: false,
      prodFormId: "",
    });
  };

  if (resLoading) {
    return <ResLoadingScreen />;
  }

  if (resError) {
    return <ResErrorScreen />;
  }

  const filterSelectProdForm = resForm?.find((e) => {
    return e.prodFormId === openFormDetail.formId;
  });

  const sendDeleteForm = async (formId) => {
    const fetcherDeleteForm = async () => {
      let dataJson = JSON.stringify({
        prodFormId: formId,
      });

      const sendUrl = `${BaseURL}${deleteProductForm}`;
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
      }
    };
    ////////// use
    await fetcherDeleteForm();
  };

  return (
    <>
      <FormProdPanel
        resForm={resForm}
        setOpenCreateForm={setOpenCreateForm}
        handleOpenFormDetail={handleOpenFormDetail}
        setOpenDeleteForm={setOpenDeleteForm}
      />

      <dialog id="my_modal_createForm" className="modal">
        {openCreateForm && (
          <DialogCreateFormPanal
            baseId={prodId}
            setOpenCreateForm={setOpenCreateForm}
            urlDetail={urlDetail}
          />
        )}
      </dialog>

      <dialog id="my_modal_EditFormProd" className="modal">
        {openFormDetail.isOpen && (
          <DialogEditFormProd
            filterSelectProdForm={filterSelectProdForm}
            handleClearOpenFormDetail={handleClearOpenFormDetail}
          />
        )}
      </dialog>

      <dialog id="my_modal_DeleteForm" className="modal">
        {openDeleteForm.isOpen && (
          <DialogConfirmDelete
            sendDelete={sendDeleteForm}
            idDelete={openDeleteForm.prodFormId}
            handleClearOpen={handleClearOpenDeleteForm}
          />
        )}
      </dialog>
    </>
  );
}

function FormProdPanel(params) {
  const {
    resForm,
    setOpenCreateForm,
    handleOpenFormDetail,
    setOpenDeleteForm,
  } = params;

  const createFormProduct = () => {
    setOpenCreateForm(true);
    window.my_modal_createForm.showModal();
  };

  return (
    <div className="h-full pb-0 overflow-x-auto scrollerBar">
      <table className="table table-pin-rows">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th className="w-[20%] ">รูปแบบสินค้า</th>
            <th className="w-[15%] text-center">ราคา</th>
            <th className="w-[20%] text-center">สถานะ</th>
            <th className=" text-end">
              <button
                className="btn btn-xs btn-outline btn-primary"
                onClick={() => createFormProduct()}
              >
                เพิ่มรูปแบบ
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {resForm?.map((e, index) => (
            <TabBleFormPanal
              key={e.prodFormId}
              index={index}
              productForm={e}
              handleOpenFormDetail={handleOpenFormDetail}
              setOpenDeleteForm={setOpenDeleteForm}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabBleFormPanal(params) {
  const { index, productForm, handleOpenFormDetail, setOpenDeleteForm } =
    params;
  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const handleFormDetail = () => {
    handleOpenFormDetail(productForm.prodFormId, productForm.prodFormTh);
    window.my_modal_EditFormProd.showModal();
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
        productForm.isEnable = data.isEnable;
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

  return (
    <tr className="hover bg-base-100">
      <th>{index + 1}</th>
      <td className="flex items-center justify-between ">
        <div className="w-5/6">
          <p>{productForm?.prodFormTh}</p>
          <p>{productForm?.prodFormEng}</p>
        </div>
      </td>
      <th className="text-center ">
        <p>{productForm?.price}</p>
      </th>

      <th>
        {productForm?.isMaterialEnable ? (
          <label
            className="px-0 cursor-pointer label w-28"
            htmlFor={productForm.prodFormId}
          >
            <span className="label-text">
              {productForm.isEnable ? "เปิดขาย" : "ปิด"}
            </span>
            <input
              id={productForm.prodFormId}
              type="checkbox"
              className="toggle toggle-success toggle-sm"
              checked={productForm.isEnable}
              onChange={() =>
                sendUpdateStatusForm(
                  productForm.prodFormId,
                  productForm.isEnable
                )
              }
            />
          </label>
        ) : (
          // </div>
          <label className="px-0 label w-28" htmlFor={productForm.prodFormId}>
            <span className="label-text">ปิดโดยคงคลัง</span>
            <input
              id={productForm.prodFormId}
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
            className="btn join-item btn-warning btn-sm text-base-100"
            onClick={() => handleFormDetail()}
          >
            {/* <box-icon
            name="edit"
            type="solid"
            size="sm"
            color="hsl(var(--wa) / var(--tw-bg-opacity))"
          ></box-icon> */}
            <span>แก้ไขรูปแบบ</span>
          </button>
          <button
            className="btn join-item btn-error btn-sm text-base-100"
            onClick={() => deleteFormProduct(productForm.prodFormId)}
          >
            <span>ลบ</span>
          </button>
        </div>
      </th>
    </tr>
  );
}

const fetcherProductDetail = (url) =>
  axios.get(url).then((res) => res.data.res);
const getProductDetail = (url) => {
  const { data, error, isLoading, mutate } = useSWR(url, fetcherProductDetail, {
    revalidateOnFocus: false,
  });
  return {
    resForm: data,
    resLoading: isLoading,
    resError: error,
    resMutate: mutate,
  };
};
