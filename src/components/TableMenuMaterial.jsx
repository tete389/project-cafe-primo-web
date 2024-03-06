import { ToastAlertContext } from "../pages/employee/EmployeeLayout";
import { useContext } from "react";
import { BaseURL, updateMaterial } from "../service/BaseURL";
import axios from "axios";

export default function TableMenuMaterial(params) {
  const {
    resMenuMaterial,
    setOpenCreateMaterial,
    setOpenUpdateStockMaterial,
    handleOpenMenuSelectDetail,
    handleOpenMenuSelectUsed,
    handleOpenDeleteMate,
  } = params;

  const handleOpenCreateMate = () => {
    setOpenCreateMaterial(true);
    window.my_modal_CreateMaterial.showModal();
  };

  const handleOpenUpdateStockMate = (mateId, mateName) => {
    setOpenUpdateStockMaterial({
      isOpen: true,
      mateIdOpen: mateId,
      mateNameOpen: mateName,
    });
    window.my_modal_UpdateStockMaterial.showModal();
  };

  return (
    <>
      <div className="h-full pb-0 overflow-auto scrollerBar">
        <table className="table table-pin-rows ">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th className="w-[25%]">ชื่อรายการ</th>
              <th className="w-[10%] text-center">หน่วย</th>
              <th className="w-[15%] text-center">ปริมาณ</th>
              <th className="w-[20%] text-center ">รายการที่ใช้งาน</th>
              <th className="w-[15%] text-center">สถานะ</th>
              <th className="px-1 text-end">
                <button
                  className=" btn btn-xs btn-outline btn-primary"
                  onClick={() => handleOpenCreateMate()}
                >
                  เพิ่มคงคลัง
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {resMenuMaterial?.map((e, index) => (
              <TaBlePanal
                key={e.mateId}
                index={index}
                resMate={e}
                handleOpenMenuSelectDetail={handleOpenMenuSelectDetail}
                handleOpenMenuSelectUsed={handleOpenMenuSelectUsed}
                handleOpenUpdateStockMate={handleOpenUpdateStockMate}
                handleOpenDeleteMate={handleOpenDeleteMate}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function TaBlePanal(params) {
  const {
    index,
    resMate,
    handleOpenMenuSelectDetail,
    handleOpenMenuSelectUsed,
    handleOpenUpdateStockMate,
    handleOpenDeleteMate,
  } = params;

  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const handleDetail = () => {
    handleOpenMenuSelectDetail(resMate.mateId, resMate.mateName);
    window.my_modal_EditMaterial.showModal();
  };

  const sendUpdateStatusMaterial = async (mateId, isEnable) => {
    const fetcherUpdateMate = async () => {
      let dataJson = JSON.stringify({
        mateId: mateId,
        isEnable: !isEnable,
      });
      const sendUrl = `${BaseURL}${updateMaterial}`;
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
        resMate.isEnable = data.isEnable;
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
    await fetcherUpdateMate();
  };

  return (
    <tr className="hover bg-base-100">
      <th>{index + 1}</th>
      <td>
        {/* <div className="flex flex-row items-center justify-between"> */}
        <p>{resMate.mateName}</p>

        {/* </div> */}
      </td>
      <th className="text-center">
        <span className="badge badge-ghost badge-sm">{resMate.mateUnit}</span>
      </th>
      <td
        className="text-center rounded-md "
        onClick={() =>
          handleOpenUpdateStockMate(resMate.mateId, resMate.mateName)
        }
      >
        <span className="btn btn-xs btn-info text-base-100">{resMate.stock}</span>
      </td>
      <td className="text-center">
        <button
          className="btn btn-xs "
          onClick={() =>
            handleOpenMenuSelectUsed(resMate.mateId, resMate.mateName)
          }
        >
          <span>ดูรายละเอียด</span>
        </button>
      </td>

      <td className="text-center rounded-l-md">
        <label className="px-0 cursor-pointer label " htmlFor={resMate.mateId}>
          <span className="label-text ">
            {resMate.isEnable ? "เปิด" : "ปิด"}
          </span>
          <input
            id={resMate.mateId}
            type="checkbox"
            className="toggle toggle-success toggle-sm"
            checked={resMate.isEnable}
            onChange={() =>
              sendUpdateStatusMaterial(resMate.mateId, resMate.isEnable)
            }
          />
        </label>
      </td>

      <td className="text-end">
      <div className="join">
        <button className="btn btn-warning btn-sm text-base-100 join-item" onClick={() => handleDetail()}>
        <span>แก้ไข</span>
          
        </button>
        <button
          className="btn btn-error btn-sm text-base-100 join-item"
          onClick={() => handleOpenDeleteMate(resMate.mateId)}
        >
          <span>ลบ</span>
        </button>
        </div>
      </td>
    </tr>
  );
}
