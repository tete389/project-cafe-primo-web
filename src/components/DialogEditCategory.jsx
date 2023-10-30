import  { useEffect, useState } from "react";
import { BaseURL, updateCategory } from "../service/BaseURL";
import axios from "axios";
import ToastAlertLoading from "./ToastAlertLoading";
import ToastAlertSuccess from "./ToastAlertSuccess";
import ToastAlertError from "./ToastAlertError";

export default function DialogEditCategory(params) {
  const { filterSelectCate, handleClearOpenMenuSelectDetail } = params;

  // const { setOnOpenToast, setResUpdateStatusState } =
  //   useContext(ToastAlertContext);

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

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, []);

  const [dataUpdateCate, setDataUpdateCate] = useState({
    cateNameTh: "",
    cateNameEng: "",
    isRecommend: filterSelectCate.isRecommend,
    cateId: filterSelectCate?.cateId,
  });

  const handleCateNameTh = (event) => {
    setDataUpdateCate((prev) => ({
      ...prev,
      cateNameTh: event.target.value,
    }));
  };

  const handleCateNameEng = (event) => {
    setDataUpdateCate((prev) => ({
      ...prev,
      cateNameEng: event.target.value,
    }));
  };

  const handleCateIsRecommend = (event) => {
    setDataUpdateCate((prev) => ({
      ...prev,
      isRecommend: event.target.checked,
    }));
  };

  const sendUpdateCategory = async () => {
    if (
      !dataUpdateCate.cateNameTh &&
      !dataUpdateCate.cateNameEng &&
      dataUpdateCate.isRecommend === filterSelectCate.isRecommend
    ) {
      return;
    }
    const fetcherUpdateMate = async () => {
      let dataJson = JSON.stringify(dataUpdateCate);
      const sendUrl = `${BaseURL}${updateCategory}`;
     
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
        filterSelectCate.cateNameTh = data.cateNameTh;
        filterSelectCate.cateNameEng = data.cateNameEng;
        filterSelectCate.isRecommend = data.isRecommend;
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

  return (
    <>
      <div className="p-0 overflow-hidden h-max modal-box">
        <form method="dialog" className="p-2 bg-base-200">
          <p className="text-3xl font-bold">{filterSelectCate?.cateNameTh}</p>
          <button
            className="absolute btn btn-sm btn-circle right-2 top-2"
            onClick={() => handleOnClose()}
          >
            ✕
          </button>
        </form>
        <div className="h-full px-0 pt-0 overflow-auto card-body scrollerBar">
          <div className="m-2 rounded-md bg-base-100">
            {filterSelectCate && (
              <div className="w-full card-body">
                <div className="flex flex-row justify-between">
                  <div className="form-control ">
                    <label className="label" htmlFor="cate-name-th">
                      <span className="label-text">
                        เปลี่ยนชื่อหมวดหมู่สินค้า - ไทย
                      </span>
                    </label>
                    <input
                      id="cate-name-th"
                      type="text"
                      value={dataUpdateCate.cateNameTh}
                      placeholder={filterSelectCate?.cateNameTh}
                      className="input input-bordered"
                      onChange={handleCateNameTh}
                    />
                  </div>

                  <div className="form-control ">
                    <label className="label" htmlFor="cate-name-eng">
                      <span className="label-text">
                        เปลี่ยนชื่อหมวดหมู่สินค้า - อังกฤษ
                      </span>
                    </label>
                    <input
                      id="cate-name-eng"
                      type="text"
                      value={dataUpdateCate.cateNameEng}
                      placeholder={filterSelectCate?.cateNameEng}
                      className="input input-bordered"
                      onChange={handleCateNameEng}
                    />
                  </div>
                </div>

                <div className="justify-between pt-1 card-actions">
                  <div className="form-control">
                    <label
                      className="pt-0 cursor-pointer label"
                      htmlFor={filterSelectCate.cateId}
                    >
                      <span className="label-text ">
                        หมวดหมู่แนะนำ :{" "}
                        {filterSelectCate.isRecommend ? "เปิดอยู่" : "ปิด"}
                      </span>
                    </label>
                    <input
                      id={filterSelectCate.cateId}
                      type="checkbox"
                      className="toggle toggle-success toggle-sm"
                      checked={dataUpdateCate.isRecommend}
                      onChange={handleCateIsRecommend}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => sendUpdateCategory()}
                  >
                    บันทัก
                  </button>
                </div>
              </div>
            )}
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
