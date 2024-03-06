import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { BaseURL, createBaseProduct } from "../service/BaseURL";
import axios from "axios";
import ToastAlertError from "./ToastAlertError";
import ToastAlertSuccess from "./ToastAlertSuccess";

export default function DialogCreateProduct(params) {
  const { prodBaseUrl, setOpenCreateProduct, handleOpenMenuSelectDetail } =
    params;
  const { mutate } = useSWRConfig();

  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });
  const [onOpenToast, setOnOpenToast] = useState(false);
  const [dataCreateBase, setDataCreateBase] = useState({
    prodTitleTh: "",
    prodTitleEng: "",
  });

  const handleBaseTitleTh = (event) => {
    if (/^[ก-๏0-9\s]+$/.test(event.target.value) || event.target.value === "") {
      setDataCreateBase((prev) => ({
        ...prev,
        prodTitleTh: event.target.value,
      }));
    }
  };

  const handleBaseTitleEng = (event) => {
    if (
      /^[a-zA-Z0-9\s]+$/.test(event.target.value) ||
      event.target.value === ""
    ) {
      setDataCreateBase((prev) => ({
        ...prev,
        prodTitleEng: event.target.value,
      }));
    }
  };

  //  send  create
  const sendCreateBase = async () => {
    const fetcherCreateProdBase = async () => {
      let dataJson = JSON.stringify(dataCreateBase);
      const sendUrl = `${BaseURL}${createBaseProduct}`;
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
        await mutate(prodBaseUrl);
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
    await fetcherCreateProdBase();
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      setOpenCreateProduct(false);
    }, 200);
    handleOpenMenuSelectDetail(
      resUpdateStatusState.resUpdate.prodBaseId,
      resUpdateStatusState.resUpdate.prodTitleTh,
      0
    ),
      window.my_modal_EditProduct.showModal();
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
          <h3 className="text-lg font-bold">สร้างสินค้า</h3>
          <div className="flex flex-wrap justify-between">
            <div className="form-control">
              <label className="label" htmlFor="prodTitleTh">
                <span className="label-text">ชื่อสินค้าภาษาไทย</span>
              </label>
              <input
                id="prodTitleTh"
                type="text"
                value={dataCreateBase.prodTitleTh}
                className="input input-bordered"
                onChange={handleBaseTitleTh}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="prodTitleEng">
                <span className="label-text">ชื่อสินค้าภาษาอังกฤษ</span>
              </label>
              <input
                id="prodTitleEng"
                type="text"
                value={dataCreateBase.prodTitleEng}
                className="input input-bordered"
                onChange={handleBaseTitleEng}
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
                  onClick={() => handleOnClose()}
                >
                  แก้ไขเพิ่มเติม
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 form-control">
              <button
                className="btn btn-primary"
                onClick={() => sendCreateBase()}
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
