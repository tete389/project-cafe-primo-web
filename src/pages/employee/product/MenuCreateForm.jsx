import { useEffect } from "react";
import { useState } from "react";
import { useSWRConfig } from "swr";
// import { BaseURL, createFormProduct } from "../service/BaseURL";
import axios from "axios";
import ToastAlertSuccess from "../../../components/ToastAlertSuccess";
import ToastAlertError from "../../../components/ToastAlertError";
import { BaseURL, createFormProduct } from "../../../service/BaseURL";
// import ToastAlertError from "./ToastAlertError";
// import ToastAlertSuccess from "./ToastAlertSuccess";

export default function MenuCreateForm(params) {
  const { baseId, setOpenCreateForm,handleFromChange2, urlDetail } = params;
  const [resUpdateStatusOrderState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });
  const { mutate } = useSWRConfig();

  const [dataCreateForm, setDataCreateForm] = useState({
    prodFormTh: "",
    prodFormEng: "",
    price: "",
    description: "",
    productBaseId: baseId,
  });
  const [onOpenToast, setOnOpenToast] = useState(false);

  const handleFormNameTh = (event) => {
    setDataCreateForm((prev) => ({
      ...prev,
      prodFormTh: event.target.value,
    }));
  };

  const handleFormNameEng = (event) => {
    setDataCreateForm((prev) => ({
      ...prev,
      prodFormEng: event.target.value,
    }));
  };

  const handleFormPrice = (event) => {
    if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
      setDataCreateForm((prev) => ({
        ...prev,
        price: Number(event.target.value),
      }));
    }
  };

  // const handleFormDescription = (event) => {
  //   setDataCreateForm((prev) => ({
  //     ...prev,
  //     description: event.target.value,
  //   }));
  // };

  //  send  create
  const sendCreateForm = async () => {
    const fetcherUpdateProd = async () => {
      let dataJson = JSON.stringify(dataCreateForm);
      const sendUrl = `${BaseURL}${createFormProduct}`;
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
       await mutate(urlDetail);
     

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
    await fetcherUpdateProd();
  };

  // let timeToOut;
  const handleOnClose = () => {
    // console.log(resUpdateStatusOrderState.resUpdate.prodFormId);
    handleFromChange2(resUpdateStatusOrderState.resUpdate.prodFormId)
    resUpdateStatusOrderState.resUpdate = ""
    // timeToOut = setTimeout(() => {
    //   setOpenCreateForm(false);
    // }, 200);
  };

  // useEffect(() => {
  //   return () => {
  //     clearTimeout(timeToOut);
  //   };
  // }, [timeToOut]);

  return (
    <>
      <div className="w-full h-full px-0 pt-0 overflow-auto card-body scrollerBar">
        <h3 className="text-lg font-bold text-center">เพิ่มรูปแบบสินค้า</h3>
        <div className="w-full card-body">
          <div className="flex flex-wrap justify-between ">
            <div className="form-control">
              <label className="label" htmlFor="prodFormTh">
                <span className="label-text">เพิ่มรูปแบบ - ไทย</span>
              </label>
              <input
                id="prodFormTh"
                type="text"
                value={dataCreateForm.prodFormTh}
                className="input input-bordered "
                onChange={handleFormNameTh}
              />
            </div>

            <div className="form-control ">
              <label className="label" htmlFor="prodFormEng">
                <span className="label-text">เพิ่มรูปแบบ - อังกฤษ</span>
              </label>
              <input
                id="prodFormEng"
                type="text"
                value={dataCreateForm.prodFormEng}
                className="input input-bordered"
                onChange={handleFormNameEng}
              />
            </div>

            <div className="form-control ">
              <label className="label" htmlFor="price">
                <span className="label-text">ราคา</span>
              </label>
              <input
                id="price"
                type="text"
                maxLength={6}
                value={dataCreateForm.price}
                className="input input-bordered"
                onChange={handleFormPrice}
              />
            </div>
          </div>
          {/* <div className="form-control">
                <span className="label-text">description</span>
                <textarea
                  id="description"
                  value={dataCreateForm.description}
                  className="textarea textarea-bordered"
                  onChange={handleFormDescription}
                ></textarea>
              </div> */}

          <div className="flex justify-center mt-6">
            {resUpdateStatusOrderState.isLoadingUpdate ? (
              <button className="w-full btn no-animation btn-active">
                <span className="loading loading-spinner loading-lg"></span>
              </button>
            ) : resUpdateStatusOrderState.resUpdate ? (
              // <form method="dialog" className="w-full">
                <button
                  className="w-full btn btn-neutral"
                  onClick={() => handleOnClose()}
                >
                  แก้ไขเพิ่มเติม
                </button>
              // </form>
            ) : (
              <button
                className="w-full btn btn-primary "
                onClick={() => sendCreateForm()}
              >
                สร้าง
              </button>
            )}
          </div>
        </div>
      </div>
      {/* </div> */}

      {/*  Toast   */}
      <>
        {onOpenToast &&
          (resUpdateStatusOrderState.resUpdate ? (
            <ToastAlertSuccess
              setOnOpenToast={setOnOpenToast}
              successMessage={"คำขอสำเร็จ"}
            />
          ) : (
            <ToastAlertError
              setOnOpenToast={setOnOpenToast}
              errorMessage={"คำขอไม่สำเร็จ"}
            />
          ))}
      </>
    </>
  );
}
