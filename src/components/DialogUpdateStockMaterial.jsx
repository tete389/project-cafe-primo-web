import { useState } from "react";
import { BaseURL, updateMaterial } from "../service/BaseURL";
import axios from "axios";
import ToastAlertError from "./ToastAlertError";
import ToastAlertSuccess from "./ToastAlertSuccess";
import { useEffect } from "react";

export default function DialogUpdateStockMaterial(params) {
  const { filterSelectMate, setOpenUpdateStockMaterial } = params;

  const [onOpenToast, setOnOpenToast] = useState(false);
  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });

  const [editStock, setEditStock] = useState({
    action: "",
    stockCount: "",
  });
  //////////////////////////////////////
  const sendUpdateStock = async (mateId) => {
    if (!editStock.stockCount) {
      handleClearStock();
      return;
    }
    const fetcherUpdateMateStock = async () => {
      let dataJson = JSON.stringify({
        mateId: mateId,
        stock:
          editStock.action === "add"
            ? Number(filterSelectMate.stock) + Number(editStock.stockCount)
            : Number(filterSelectMate.stock) - Number(editStock.stockCount),
      });
      const sendUrl = `${BaseURL}${updateMaterial}`;
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
        filterSelectMate.stock = data.stock;
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
        handleClearStock();
      }
    };
    ////////// use
    if (editStock.stockCount === "" || Number(editStock.stockCount) === 0) {
      handleClearStock();
      return;
    }
    await fetcherUpdateMateStock();
  };

  const handleEditStock = (newValue) => {
    setEditStock((prev) => ({ ...prev, action: newValue }));
  };

  const handleClearStock = () => {
    setEditStock(() => ({ stockCount: "", action: "" }));
  };

  const handleStock = (event) => {
    if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
      setEditStock((prev) => ({ ...prev, stockCount: event.target.value }));
    }
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      handleClearStock();
      setOpenUpdateStockMaterial({
        isOpen: false,
        mateIdOpen: "",
        mateNameOpen: "",
      });
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, []);

  return (
    <>
      <div className="p-0 modal-box bg-base-100">
        <form method="dialog">
          <button
            className="absolute btn btn-sm btn-circle right-2 top-2 btn-ghost "
            onClick={() => handleOnClose()}
          >
            ✕
          </button>
        </form>
        <div className="card-body">
          <h3 className="text-lg font-bold">ควบคุมปริมาณสินค้าคงคลัง</h3>
          <p className="flex justify-between">
            <span>{filterSelectMate?.mateName}</span>
            <span>หน่วย : {filterSelectMate?.mateUnit}</span>
            <span>ปริมาณ : {filterSelectMate?.stock}</span>
          </p>

          {editStock.action === "add" ? (
            <div className="form-control">
              <label className="input-group " htmlFor="text-plus">
                <button
                  className="btn btn-accent "
                  onClick={() => {
                    if (resUpdateStatusState.isLoadingUpdate) {
                      return;
                    }
                    sendUpdateStock(filterSelectMate.mateId);
                  }}
                >
                  {resUpdateStatusState.isLoadingUpdate ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>เพิ่ม</>
                  )}
                </button>
                <input
                  id="text-plus"
                  type="text"
                  value={editStock.stockCount}
                  className="input input-bordered "
                  maxLength={5}
                  onChange={handleStock}
                />
              </label>
            </div>
          ) : editStock.action === "reduce" ? (
            <div className="form-control">
              <label className="input-group" htmlFor="text-midus">
                <input
                  id="text-midus"
                  type="text"
                  value={editStock.stockCount}
                  className=" input input-bordered"
                  maxLength={5}
                  onChange={handleStock}
                />
                <button
                  className="btn btn-active"
                  onClick={() => {
                    if (resUpdateStatusState.isLoadingUpdate) {
                      return;
                    }
                    sendUpdateStock(filterSelectMate.mateId);
                  }}
                >
                  {resUpdateStatusState.isLoadingUpdate ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>ลค</>
                  )}
                </button>
              </label>
            </div>
          ) : (
            <>
              <button
                className="btn btn-accent btn-xs"
                onClick={() => handleEditStock("add")}
              >
                เพิ่ม
              </button>
              <button
                className="btn btn-active btn-xs"
                onClick={() => handleEditStock("reduce")}
              >
                ลด
              </button>
            </>
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
