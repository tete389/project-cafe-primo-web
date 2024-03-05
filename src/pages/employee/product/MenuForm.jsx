/* eslint-disable react-hooks/rules-of-hooks */

import { useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { useContext } from "react";
import { ToastAlertContext } from "../EmployeeLayout";
import ResLoadingScreen from "../../../components/ResLoadingScreen";
import ResErrorScreen from "../../../components/ResErrorScreen";
import {
  BaseURL,
  deleteProductForm,
  findProductFormByBaseId,
} from "../../../service/BaseURL";
import DialogCreateFormPanal from "../../../components/DialogCreateFormPanal";
import DialogConfirmDelete from "../../../components/DialogConfirmDelete";
import DialogEditFormProd from "../../../components/DialogEditFormProd";
import MenuEditForm from "./MenuEditForm";
import { Tab, Tabs } from "@mui/material";
import MenuCreateForm from "./MenuCreateForm";

export default function MenuForm(params) {
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

  const [valueFrom, setValueFrom] = useState(0);
  const handleFromChange = (event, newValue) => {
    setValueFrom(newValue);
    setOpenFormDetail({
      formId: event.target.id ? event.target.id : 0,
    });
  };

  const handleFromChange2 = (fromId) => {
    const filterSelectProdForm = resForm?.findIndex((e) => {
      return e.prodFormId === fromId;
    });
    setValueFrom(filterSelectProdForm + 1);
    setOpenFormDetail({
      formId: fromId ? fromId : 0,
    });
  };

  if (resLoading) {
    return <ResLoadingScreen />;
  }

  if (resError) {
    return <ResErrorScreen />;
  }

  const filterSelectProdForm = resForm?.find((e) => {
    return e.prodFormId == openFormDetail.formId;
  });

  const sendDeleteForm = async (formId) => {
    const fetcherDeleteForm = async () => {
      let dataJson = JSON.stringify({
        prodFormId: formId,
      });

      console.log(dataJson);
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
        setValueFrom(0);
        setOpenFormDetail({
          formId: 0,
        });
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
      <div className="mt-[1px] divider mb-[1px]"></div>
      <div className="flex">
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={valueFrom}
          onChange={handleFromChange}
          aria-label="Vertical tabs from"
          // sx={{ borderRight: 1, borderColor: "divider", width:"60px" }}
        >
          <Tab label={"เพิ่มรูปแบบ / add from"} wrapped />
          {resForm?.map((e, index) => (
            <Tab
              id={e.prodFormId}
              key={e.prodFormId}
              label={e.prodFormTh + " / " + e.prodFormEng}
              wrapped
            />
          ))}
        </Tabs>
        {openFormDetail.formId ? (
          <MenuEditForm
            sendDeleteForm={sendDeleteForm}
            urlDetailBase={urlDetail}
            filterSelectProdForm={filterSelectProdForm}
            handleClearOpenFormDetail={handleClearOpenFormDetail}
            setOpenDeleteForm={setOpenDeleteForm}
          />
        ) : (
          <MenuCreateForm
            baseId={prodId}
            handleFromChange2={handleFromChange2}
            urlDetail={urlDetail}
          />
        )}
      </div>

      {/* <FormProdPanel
        resForm={resForm}
        setOpenCreateForm={setOpenCreateForm}
        handleOpenFormDetail={handleOpenFormDetail}
        setOpenDeleteForm={setOpenDeleteForm}
      /> */}

      {/* <dialog id="my_modal_createForm" className="modal">
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
      </dialog> */}

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
            <th className="w-[40%] ">รูปแบบสินค้า</th>
            <th className="w-[15%] text-center">ราคา</th>
            <th className="w-[20%] text-center">สถานะ</th>
            <th className="px-1 text-end">
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
        <button onClick={() => handleFormDetail()}>
          <box-icon
            name="edit"
            type="solid"
            size="sm"
            color="hsl(var(--wa) / var(--tw-bg-opacity))"
          ></box-icon>
        </button>
      </td>
      <th className="text-center ">
        <p>{productForm?.price}</p>
      </th>

      <th>
        {productForm?.isMaterialEnable ? (
          // <div className="form-control">
          <label
            className="px-0 cursor-pointer label"
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
          <label className="px-0 label" htmlFor={productForm.prodFormId}>
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
        <button
          className="btn btn-error btn-xs text-base-100"
          onClick={() => deleteFormProduct(productForm.prodFormId)}
        >
          <span>ลบ</span>
        </button>
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
