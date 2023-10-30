import { ToastAlertContext } from "../pages/employee/EmployeeLayout";
import { useContext } from "react";
import { BaseURL, updateAddOn } from "../service/BaseURL";
import axios from "axios";

export default function TableMenuAddOn(params) {
  const {
    resMenuAddOn,
    handleOpenMenuAddOnDetail,
    handleOpenMenuOption,
    setOpenCreateAddOn,
    handleOpenDeleteAddOn,
  } = params;

  const handleOpenCreateAddOn = () => {
    setOpenCreateAddOn(true);
    window.my_modal_CreateAddOn.showModal();
  };
  return (
    <>
      <div className="h-full pb-0 overflow-auto scrollerBar">
        <table className="table table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th className="w-[25%]">ชื่อหัวข้อตัวเลือก</th>
              <th className="w-[25%] text-center">ตัวเลือกย่อย</th>
              <th className="w-[15%] text-center">สถานะ</th>
              <th className="px-1 text-end">
                <button
                  className=" btn btn-xs btn-outline btn-primary"
                  onClick={() => handleOpenCreateAddOn()}
                >
                  เพิ่มตัวเลือกสินค้า
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {resMenuAddOn?.map((e, index) => (
              <TaBlePanalAddOn
                key={e.addOnId}
                index={index}
                resAddOn={e}
                handleOpenMenuAddOnDetail={handleOpenMenuAddOnDetail}
                handleOpenMenuOption={handleOpenMenuOption}
                handleOpenDeleteAddOn={handleOpenDeleteAddOn}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function TaBlePanalAddOn(params) {
  const {
    index,
    resAddOn,
    handleOpenMenuAddOnDetail,
    handleOpenMenuOption,
    handleOpenDeleteAddOn,
  } = params;
  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const handleDetail = () => {
    handleOpenMenuAddOnDetail(resAddOn.addOnId, resAddOn.addOnTitleTh);
    window.my_modal_EditAddOn.showModal();
  };

  const sendUpdateStatusAddOn = async (addOnId, isEnable) => {
    const fetcherUpdateAddOn = async () => {
      let dataJson = JSON.stringify({
        addOnId: addOnId,
        isEnable: !isEnable,
      });
      const sendUrl = `${BaseURL}${updateAddOn}`;
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
        resAddOn.isEnable = data.isEnable;
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
    await fetcherUpdateAddOn();
  };

  return (
    <tr className="hover bg-base-100">
      <th>{index + 1}</th>
      <td className="flex items-center justify-between rounded-md">
        <div className="w-5/6">
          <p>{resAddOn.addOnTitleTh}</p>
          <p>{resAddOn.addOnTitleEng}</p>
        </div>
        <button onClick={() => handleDetail()}>
          <box-icon
            name="edit"
            type="solid"
            size="sm"
            color="hsl(var(--wa) / var(--tw-bg-opacity))"
          ></box-icon>
        </button>
      </td>

      <td className="text-center">
        <button
          className="btn btn-xs"
          onClick={() =>
            handleOpenMenuOption(resAddOn.addOnId, resAddOn.addOnTitleTh)
          }
        >
          ดูรายละเอียด
        </button>
      </td>
      <td className="text-center rounded-l-md">
        <label className="cursor-pointer label" htmlFor={resAddOn.addOnId}>
          <span className="label-text ">
            {resAddOn.isEnable ? "เปิด" : "ปิด"}
          </span>
          <input
            id={resAddOn.addOnId}
            type="checkbox"
            className="toggle toggle-success toggle-sm"
            checked={resAddOn.isEnable}
            onChange={() =>
              sendUpdateStatusAddOn(resAddOn.addOnId, resAddOn.isEnable)
            }
          />
        </label>
      </td>
      <td className="text-end">
        <button
          className="btn btn-error btn-xs text-base-100"
          onClick={() => handleOpenDeleteAddOn(resAddOn.addOnId)}
        >
          <span>ลบ</span>
        </button>
      </td>
    </tr>
  );
}
