/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import ToastAlertError from "./ToastAlertError";
import ToastAlertSuccess from "./ToastAlertSuccess";
import useSWR, { useSWRConfig } from "swr";
import {
  BaseURL,
  createMaterialUsed,
  deleteBaseFromCategory,
  deleteMaterialUsed,
  findProductBaseById,
  haveCategory,
  haveMateUse,
  updateProductBase,
  uploadImage,
} from "../service/BaseURL";
import axios from "axios";
import DialogAddMaterialUse from "./DialogAddMaterialUse";
import ResLoadingScreen from "./ResLoadingScreen";
import ResErrorScreen from "./ResErrorScreen";

import DialogAddCategoryPanal from "./DialogAddCategoryPanal";
import ToastAlertLoading from "./ToastAlertLoading";
import { Tab, Tabs } from "@mui/material";
import DialogEditFormProd from "./DialogEditFormProd";
import MenuForm from "../pages/employee/product/MenuForm";
import DialogEditMaterialUse from "./DialogEditMaterialUse";

export default function DialogEditProduct(params) {
  const { filterSelectProdBase, handleClearOpenMenuSelectDetail } = params;

  const urlDetail = `${BaseURL}${findProductBaseById}${filterSelectProdBase.prodBaseId}&${haveMateUse}&${haveCategory}`;
  const { resProductDetail, resLoading, resError } =
    getProductDetail(urlDetail);

  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });
  const [onOpenToast, setOnOpenToast] = useState(false);

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      handleClearOpenMenuSelectDetail();
    }, 200);
  };

  const [valueBase, setValueBase] = useState(0);
  const handleBaseChange = (event, newValue) => {
    setValueBase(newValue);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, [timeToOut]);

  // console.log(resProductDetail);
  if (resLoading) {
    return (
      <>
        <div className="h-full p-0 overflow-hidden modal-box">
          <form method="dialog" className="p-2 bg-base-200">
            <button
              className="absolute btn btn-sm btn-circle right-2 top-2"
              onClick={() => handleOnClose()}
            >
              ✕
            </button>
          </form>
          <div className="card-body">
            <ResLoadingScreen />
          </div>
        </div>
      </>
    );
  }

  if (resError) {
    return (
      <>
        <div className="h-full p-0 overflow-hidden modal-box">
          <form method="dialog" className="p-2 bg-base-200">
            <button
              className="absolute btn btn-sm btn-circle right-2 top-2"
              onClick={() => handleOnClose()}
            >
              ✕
            </button>
          </form>
          <div className="card-body">
            <ResErrorScreen />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="h-full p-0 overflow-hidden modal-box ">
        <form method="dialog" className="p-2 bg-base-200">
          <p className="text-3xl font-bold">
            {filterSelectProdBase?.prodTitleTh}
          </p>
          <button
            className="absolute btn btn-sm btn-circle right-2 top-2"
            onClick={() => handleOnClose()}
          >
            ✕
          </button>
        </form>
        <div className="h-full px-0 pt-0 overflow-auto card-body scrollerBar">
          <Tabs
            value={valueBase}
            onChange={handleBaseChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="scrollable force tabs example"
          >
            <Tab label="รายละเอียดสินค้า" />
            <Tab label="รูปแบบสินค้า" />
            {/* <Tab label="เพิ่มเติม" /> */}
          </Tabs>
          {valueBase === 0 ? (
            <>
              <div className="m-2 rounded-md bg-base-100">
                {resProductDetail && (
                  <EditProductPanel
                    filterSelectProdBase={filterSelectProdBase}
                    setOnOpenToast={setOnOpenToast}
                    setResUpdateStatusState={setResUpdateStatusState}
                  />
                )}
              </div>
              <div className="m-2 rounded-md bg-base-200">
                {resProductDetail && (
                  <AddCategoryPanel
                    resProductDetail={resProductDetail}
                    urlDetail={urlDetail}
                    setOnOpenToast={setOnOpenToast}
                    setResUpdateStatusState={setResUpdateStatusState}
                  />
                )}
              </div>

              <div className="m-2 mb-10 rounded-md bg-base-200">
                {resProductDetail && (
                  <AddMaterialPanel
                    resProductDetail={resProductDetail}
                    urlDetail={urlDetail}
                    setOnOpenToast={setOnOpenToast}
                    setResUpdateStatusState={setResUpdateStatusState}
                  />
                )}
              </div>
            </>
          ) : valueBase === 1 ? (
            <>
              <MenuForm prodId={filterSelectProdBase.prodBaseId} />
            </>
          )  : (
            <></>
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

function EditProductPanel(params) {
  const { filterSelectProdBase, setOnOpenToast, setResUpdateStatusState } =
    params;

  const [dataUpdateBase, setDataUpdateBase] = useState({
    prodTitleTh: "",
    prodTitleEng: "",
    description: "",
    prodBaseId: filterSelectProdBase.prodBaseId,
  });

  const handleFormNameTh = (event) => {
    setDataUpdateBase((prev) => ({
      ...prev,
      prodTitleTh: event.target.value,
    }));
  };

  const handleFormNameEng = (event) => {
    setDataUpdateBase((prev) => ({
      ...prev,
      prodTitleEng: event.target.value,
    }));
  };

  const handleFormDescription = (event) => {
    setDataUpdateBase((prev) => ({
      ...prev,
      description: event.target.value,
    }));
  };

  //  send  update
  const sendUpdateBase = async () => {
    if (
      !dataUpdateBase.prodTitleTh &&
      !dataUpdateBase.description &&
      !dataUpdateBase.prodTitleEng
    ) {
      return;
    }
    const fetcherUpdateBase = async () => {
      let dataJson = JSON.stringify(dataUpdateBase);
      const sendUrl = `${BaseURL}${updateProductBase}`;

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
        filterSelectProdBase.prodTitleTh = data.prodTitleTh;
        filterSelectProdBase.prodTitleEng = data.prodTitleEng;
        filterSelectProdBase.description = data.description;
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
    await fetcherUpdateBase();
  };

  const [images, setImages] = useState([]);
  // const [imagesURLs, setImagesURLs] = useState([]);

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = [];
    images.forEach((e) => newImageUrls.push(URL.createObjectURL(e)));
    // setImagesURLs(newImageUrls);
  }, [images]);

  const handleImageChange = (event) => {
    setImages([...event.target.files]);
  };

  const handleImage = (event) => {
    event.target.src = "/images/cafe_image3.jpg";
  };

  //  send  updLoad image
  const sendUpLoadImage = async () => {
    if (images.length < 1) return;
    const fetcherUpdateBaseImage = async () => {
      const formData = new FormData();
      formData.append("baseId", dataUpdateBase.prodBaseId);
      formData.append("file", images[0]);
      const sendUrl = `${BaseURL}${uploadImage}`;
      setOnOpenToast(true);
      setResUpdateStatusState((prev) => ({
        ...prev,
        isLoadingUpdate: true,
      }));
      try {
        const response = await axios.put(sendUrl, formData);
        const data = await response.data.res;
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: data,
          errorUpdate: "",
        }));
        // mutate(prodBaseUrl);
        filterSelectProdBase.image = data.image;
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
    await fetcherUpdateBaseImage();
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <div className="card-body lg:w-[50%] w-full">
          <div className="form-control ">
            <label className="label" htmlFor="prodTitleTh">
              <span className="label-text">เปลี่ยนชื่อสินค้า - ไทย</span>
            </label>
            <input
              id="prodTitleTh"
              type="text"
              value={dataUpdateBase.prodTitleTh}
              placeholder={filterSelectProdBase?.prodTitleTh}
              className="input input-bordered"
              onChange={handleFormNameTh}
            />
          </div>

          <div className="form-control ">
            <label className="label" htmlFor="prodTitleEng">
              <span className="label-text">เปลี่ยนชื่อสินค้า - อังกฤษ</span>
            </label>
            <input
              id="prodTitleEng"
              type="text"
              value={dataUpdateBase.prodTitleEng}
              placeholder={filterSelectProdBase?.prodTitleEng}
              className="input input-bordered"
              onChange={handleFormNameEng}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="description">
              <span className="label-text">คำอธิบาย</span>
            </label>
            <textarea
              id="description"
              value={dataUpdateBase.description}
              placeholder={filterSelectProdBase?.description}
              className="textarea textarea-bordered"
              onChange={handleFormDescription}
            ></textarea>
          </div>

          <div className="justify-end pt-1 card-actions">
            <button
              className="btn btn-primary"
              onClick={() => sendUpdateBase()}
            >
              บันทัก
            </button>
          </div>
          {/* </div> */}
        </div>

        <div className="flex flex-col items-center justify-center lg:w-[50%] w-full pb-5">
          <figure>
            {/* {imagesURLs.length > 0 ? (
                imagesURLs.map((e, index) => (
                  <img
                    key={index}
                    src={e}
                    alt="caffe"
                    className="object-cover w-40 rounded-md h-36"
                  />
                ))
              ) :  */}
            {filterSelectProdBase.image === "none" ? (
              <img
                src={`/images/cafe_image3.jpg`}
                alt="caffe"
                className="object-cover w-40 rounded-md h-36"
              />
            ) : (
              <img
                src={`${filterSelectProdBase.image}`}
                alt="caffe"
                onError={handleImage}
                className="object-cover w-40 rounded-md h-36"
              />
            )}
          </figure>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full max-w-xs mt-2 file-input file-input-bordered"
          />

          <button
            className="mt-2 btn btn-primary"
            onClick={() => sendUpLoadImage()}
          >
            อัปโหลด
          </button>
        </div>
      </div>
    </>
  );
}

function AddCategoryPanel(params) {
  const {
    resProductDetail,
    urlDetail,
    setOnOpenToast,
    setResUpdateStatusState,
  } = params;
  const { mutate } = useSWRConfig();

  const openAdd = () => {
    setOpenAddCategory(true);
    window.my_modal_addCategory.showModal();
  };

  const closeAdd = () => {
    setOpenAddCategory(false);
    window.my_modal_addCategory.close();
  };

  const [openAddCategory, setOpenAddCategory] = useState(false);

  const sendDeleteCategoryProduct = async (prodId, cateId) => {
    // const newCate = resProductDetail.category?.filter((el) => {
    //   if (el.cateId !== cateId) {
    //     return {
    //       cateId: el.cateId,
    //     };
    //   }
    // });
    const deleteCate = [
      {
        cateId: cateId,
      },
    ];
    const fetcherUpdateProd = async () => {
      let dataJson = JSON.stringify({
        prodBaseId: prodId,
        listCategory: deleteCate,
      });

      const sendUrl = `${BaseURL}${deleteBaseFromCategory}`;
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
    await fetcherUpdateProd();
  };

  return (
    <>
      <div className="card-body">
        <div className="flex justify-between">
          <span className="font-bold">หมวดหมู่สินค้า</span>
          <button
            className="btn btn-xs btn-outline btn-primary"
            onClick={() => openAdd()}
          >
            เพิ่มหมวดหมู่
          </button>
        </div>

        <div>
          {resProductDetail?.category.map((e) => (
            <div key={e.cateId} className="px-2 pt-3 join">
              <span className="join-item badge badge-ghost badge-lg bg-base-100">
                {e.cateNameTh}
              </span>
              <button
                className="join-item btn btn-xs bg-base-100"
                onClick={() =>
                  sendDeleteCategoryProduct(
                    resProductDetail.prodBaseId,
                    e.cateId
                  )
                }
              >
                <box-icon name="x-circle"></box-icon>
              </button>
            </div>
          ))}
        </div>
      </div>

      <dialog id="my_modal_addCategory" className="modal">
        {openAddCategory && (
          <DialogAddCategoryPanal
            resProductDetail={resProductDetail}
            closeAdd={closeAdd}
            urlDetail={urlDetail}
            setResUpdateStatusState={setResUpdateStatusState}
            setOnOpenToast={setOnOpenToast}
          />
        )}
      </dialog>
    </>
  );
}

function AddMaterialPanel(params) {
  const {
    resProductDetail,
    urlDetail,
    setOnOpenToast,
    setResUpdateStatusState,
  } = params;

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

  const openEdit = () => {
    setOpenAddMaterailUse(true);
    window.my_modal_editMaterialUse.showModal();
  };

  const closeEdit = () => {
    setOpenAddMaterailUse(false);
    window.my_modal_editMaterialUse.close();
  };

  const sendDeleteMaterialUsed = async (prodId, mateId) => {
    const deleteMateUse = [
      {
        mateId: mateId,
      },
    ];
    const fetcherDelMateUse = async () => {
      let dataJson = JSON.stringify({
        prodBaseId: prodId,
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
  const sendUpdateProdBaseMateUsed = async (prodId, mateCheck) => {
    const result = mateCheck.filter((e) => {
      return e.useCount;
    });
    if (result.length <= 0) {
      // handleOnClose();
      return;
    }
    const fetcherUpdateProdBaseMateUsed = async () => {
      let dataJson = JSON.stringify({
        prodBaseId: prodId,
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
    await fetcherUpdateProdBaseMateUsed();
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
          {resProductDetail.materialUse?.map((e) => (
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
                  sendDeleteMaterialUsed(resProductDetail.prodBaseId, e.mateId)
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
            idIsUsed={resProductDetail.prodBaseId}
            materialUse={resProductDetail.materialUse}
            closeAdd={closeAdd}
            sendUpdateMateUsed={sendUpdateProdBaseMateUsed}
          />
        )}
      </dialog>

      <dialog id="my_modal_editMaterialUse" className="modal">
        {openAddMaterailUse && (
          <DialogEditMaterialUse
            idIsUsed={resProductDetail.prodBaseId}
            materialUse={resProductDetail.materialUse}
            closeEdit={closeEdit}
            sendUpdateMateUsed={sendUpdateProdBaseMateUsed}
          />
        )}
      </dialog>
    </>
  );
}

const fetcherProductDetail = (url) =>
  axios.get(url).then((res) => res.data.res);
const getProductDetail = (url) => {
  const { data, error, isLoading, mutate } = useSWR(url, fetcherProductDetail, {
    revalidateOnFocus: false,
  });
  return {
    resProductDetail: data,
    resLoading: isLoading,
    resError: error,
    resMutate: mutate,
  };
};
