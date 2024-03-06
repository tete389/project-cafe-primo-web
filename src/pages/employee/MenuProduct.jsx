/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import {
  BaseURL,
  deleteProductBase,
  findProductBaseAll,
  haveCountform,
  pageNum,
  pageSize,
} from "../../service/BaseURL";
import TableMenuProduct from "../../components/TableMenuProduct";
import TableMenuForm from "../../components/TableMenuForm";
import DialogCreateProduct from "../../components/DialogCreateProduct";
import ResLoadingScreen from "../../components/ResLoadingScreen";
import ResErrorScreen from "../../components/ResErrorScreen";
import DialogEditProduct from "../../components/DialogEditProduct";
import { ToastAlertContext } from "./EmployeeLayout";
import { useContext } from "react";
import DialogConfirmDelete from "../../components/DialogConfirmDelete";

export default function MenuProduct() {
  const prodBaseUrl = `${BaseURL}${findProductBaseAll}?${haveCountform}&${pageSize}50&${pageNum}0`;
  const { resMenuProduct, resLoading, resError } = getMenuProduct(prodBaseUrl);

  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const [openCreateProduct, setOpenCreateProduct] = useState(false);

  const [openSelectDetail, setOpenSelectDetail] = useState({
    isOpen: false,
    prodIdOpen: "",
    prodNameOpen: "",
    keyPage: 0,
  });
  const [openSelectForm, setOpenSelectForm] = useState({
    isOpen: false,
    prodIdOpen: "",
    prodNameOpen: "",
  });

  const [openDeleteProdBase, setOpenDeleteProdBase] = useState({
    isOpen: false,
    prodBased: "",
  });

  const handleOpenMenuSelectDetail = (prodId, prodName, key) => {
    setOpenSelectDetail({
      isOpen: true,
      prodIdOpen: prodId,
      prodNameOpen: prodName,
      keyPage: key,
    });
  };

  const handleClearOpenMenuSelectDetail = () => {
    setOpenSelectDetail({
      isOpen: false,
      prodIdOpen: "",
      prodNameOpen: "",
      keyPage: 0,
    });
  };

  const handleOpenMenuSelectForm = (prodId, prodName) => {
    setOpenSelectForm({
      isOpen: true,
      prodIdOpen: prodId,
      prodNameOpen: prodName,
    });
  };

  const handleClearOpenMenuSelectForm = () => {
    setOpenSelectForm({
      isOpen: false,
      prodIdOpen: "",
      prodNameOpen: "",
    });
  };

  const handleOpenCreateProduct = () => {
    setOpenCreateProduct(true);
    window.my_modal_CreateProduct.showModal();
  };

  const handleOpenDeleteBaseProduct = (baseId) => {
    setOpenDeleteProdBase({ isOpen: true, prodBased: baseId });
    window.my_modal_DeleteProdBase.showModal();
  };

  const handleClearOpenDeleteProdBase = () => {
    setOpenDeleteProdBase({
      isOpen: false,
      prodBased: "",
    });
  };

  if (resLoading) {
    return <ResLoadingScreen />;
  }

  if (resError) {
    return <ResErrorScreen />;
  }
  const filterSelectProdBase = resMenuProduct?.find((e) => {
    return e.prodBaseId === openSelectDetail.prodIdOpen;
  });

  const sendDeleteBase = async (baseId) => {
    const fetcherDeleteBase = async () => {
      let dataJson = JSON.stringify({
        prodBaseId: baseId,
      });

      const sendUrl = `${BaseURL}${deleteProductBase}`;
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
        mutate(prodBaseUrl);
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
    await fetcherDeleteBase();
  };

  return (
    <>
      <>
        <div className="flex flex-row items-center justify-between h-12 p-2 mt-1 rounded-t-md bg-base-200">
          <div className="text-2xl font-extrabold text-base-content breadcrumbs scrollerBar">
            <ul>
              {openSelectForm.isOpen ? (
                <>
                  <li onClick={handleClearOpenMenuSelectForm}>
                    <a className="underline">รายการสินค้า</a>
                  </li>

                  <li className="pr-2">{openSelectForm.prodNameOpen}</li>
                </>
              ) : (
                <li className="pr-2">รายการสินค้า</li>
              )}
            </ul>
          </div>
        </div>

        {openSelectForm.isOpen ? (
          <div className={`h-full overflow-hidden rounded-b-md bg-base-200  `}>
            <TableMenuForm prodId={openSelectForm.prodIdOpen} />{" "}
          </div>
        ) : (
          <></>
        )}

        <div
          className={`h-full overflow-hidden rounded-b-md bg-base-200  ${
            openSelectForm.isOpen && `hidden`
          } `}
        >
          <TableMenuProduct
            handleOpenMenuSelect={handleOpenMenuSelectDetail}
            handleOpenMenuSelectForm={handleOpenMenuSelectForm}
            resMenuProduct={resMenuProduct}
            handleOpenCreateProduct={handleOpenCreateProduct}
            handleOpenDeleteBaseProduct={handleOpenDeleteBaseProduct}
          />
        </div>
      </>

      {/*  Dialog   */}
      <>
        <dialog id="my_modal_CreateProduct" className=" modal">
          {openCreateProduct && (
            <DialogCreateProduct
              prodBaseUrl={prodBaseUrl}
              setOpenCreateProduct={setOpenCreateProduct}
              handleOpenMenuSelectDetail={handleOpenMenuSelectDetail}
            />
          )}
        </dialog>

        <dialog id="my_modal_EditProduct" className="modal">
          {openSelectDetail.isOpen && (
            <DialogEditProduct
              keyPage={openSelectDetail.keyPage}
              filterSelectProdBase={filterSelectProdBase}
              handleClearOpenMenuSelectDetail={handleClearOpenMenuSelectDetail}
            />
          )}
        </dialog>

        <dialog id="my_modal_DeleteProdBase" className="modal">
          {openDeleteProdBase.isOpen && (
            <DialogConfirmDelete
              sendDelete={sendDeleteBase}
              idDelete={openDeleteProdBase.prodBased}
              handleClearOpen={handleClearOpenDeleteProdBase}
            />
          )}
        </dialog>
      </>
    </>
  );
}

const fetcherMenuProduct = (url) => axios.get(url).then((res) => res.data.res);
const getMenuProduct = (url) => {
  const { data, error, isLoading, mutate } = useSWR(url, fetcherMenuProduct, {
    revalidateOnFocus: false,
  });
  return {
    resMenuProduct: data,
    resLoading: isLoading,
    resError: error,
    resMutate: mutate,
  };
};
