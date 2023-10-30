/* eslint-disable react-hooks/rules-of-hooks */
import { useContext } from "react";
import { useState } from "react";
import {
  BaseURL,
  deleteMaterial,
  findMaterialAll,
  findUseByMaterialId,
} from "../../service/BaseURL";
import axios from "axios";
import useSWR, { mutate } from "swr";
import DialogCreateMaterail from "../../components/DialogCreateMaterail";
import { ToastAlertContext } from "./EmployeeLayout";
import DialogUpdateStockMaterial from "../../components/DialogUpdateStockMaterial";
import ResLoadingScreen from "../../components/ResLoadingScreen";
import ResErrorScreen from "../../components/ResErrorScreen";
import TableMenuMaterial from "../../components/TableMenuMaterial";
import DialogEditMaterial from "../../components/DialogEditMaterial";
import DialogConfirmDelete from "../../components/DialogConfirmDelete";

export default function MenuMaterial() {
  const mateUrl = `${BaseURL}${findMaterialAll}`;
  const { resMenuMaterial, resLoading, resError } = getMenuMaterial(mateUrl);

  const { setOnOpenToast, setResUpdateStatusState } =
  useContext(ToastAlertContext);

  const [openCreateMaterial, setOpenCreateMaterial] = useState(false);
  const [openUpdateStockMaterial, setOpenUpdateStockMaterial] = useState({
    isOpen: false,
    mateIdOpen: "",
    mateNameOpen: "",
  });

  const [openSelectDetail, setOpenSelectDetail] = useState({
    isOpen: false,
    mateIdOpen: "",
    mateNameOpen: "",
  });

  const [openSelectUsed, setOpenSelectUsed] = useState({
    isOpen: false,
    mateIdOpen: "",
    mateNameOpen: "",
  });

  const [openDeleteMate, setOpenDeleteMate] = useState({
    isOpen: false,
    mateId: "",
  });

  const handleOpenMenuSelectDetail = (mateId, mateName) => {
    setOpenSelectDetail({
      isOpen: true,
      mateIdOpen: mateId,
      mateNameOpen: mateName,
    });
  };

  const handleClearOpenMenuSelectDetail = () => {
    setOpenSelectDetail({
      isOpen: false,
      mateIdOpen: "",
      mateNameOpen: "",
    });
  };

  const handleOpenMenuSelectUsed = (mateId, mateName) => {
    setOpenSelectUsed({
      isOpen: true,
      mateIdOpen: mateId,
      mateNameOpen: mateName,
    });
  };

  const handleClearOpenMenuSelectUsed = () => {
    setOpenSelectUsed({
      isOpen: false,
      mateIdOpen: "",
      mateNameOpen: "",
    });
  };

  const handleOpenDeleteMate = (mateId) => {
    setOpenDeleteMate({ isOpen: true, mateId: mateId });
    window.my_modal_DeleteMate.showModal();
  };

  const handleClearOpenDeleteMate = () => {
    setOpenDeleteMate({
      isOpen: false,
      mateId: "",
    });
  };

  const sendDeleteBase = async (mateId) => {
    const fetcherDeleteBase = async () => {
      let dataJson = JSON.stringify({
        mateId: mateId,
      });
      const sendUrl = `${BaseURL}${deleteMaterial}`;
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
        mutate(mateUrl);
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

  if (resLoading) {
    return <ResLoadingScreen />;
  }

  if (resError) {
    return <ResErrorScreen />;
  }

  const filterSelectMate = resMenuMaterial?.find((e) => {
    return (
      e.mateId === openSelectDetail.mateIdOpen ||
      e.mateId === openUpdateStockMaterial.mateIdOpen ||
      e.mateId === openSelectUsed.mateIdOpen
    );
  });

  return (
    <>
      <div className="flex flex-row items-center justify-between h-12 p-2 mt-1 rounded-t-md bg-base-200">
        <div className="text-2xl font-extrabold text-base-content breadcrumbs ">
          <ul>
            {openSelectUsed.isOpen ? (
              <>
                <li onClick={handleClearOpenMenuSelectUsed}>
                  <a className="underline">รายการสินค้าคงคลัง</a>
                </li>
                {openSelectUsed?.mateNameOpen && (
                  <li className="pr-2">{openSelectUsed.mateNameOpen}</li>
                )}
              </>
            ) : (
              <li className="pr-2">รายการสินค้าคงคลัง</li>
            )}
          </ul>
        </div>
      </div>

      {openSelectUsed.isOpen ? (
        <div className={`h-full overflow-hidden rounded-b-md bg-base-200  `}>
          <TableMenuMateUsed filterSelectMate={filterSelectMate} />
        </div>
      ) : (
        <></>
      )}

      <div
        className={`h-full overflow-hidden rounded-b-md bg-base-200  ${
          openSelectUsed.isOpen && `hidden`
        } `}
      >
        <TableMenuMaterial
          resMenuMaterial={resMenuMaterial}
          setOpenCreateMaterial={setOpenCreateMaterial}
          setOpenUpdateStockMaterial={setOpenUpdateStockMaterial}
          handleOpenMenuSelectDetail={handleOpenMenuSelectDetail}
          handleOpenMenuSelectUsed={handleOpenMenuSelectUsed}
          handleOpenDeleteMate={handleOpenDeleteMate}
        />
      </div>

      {/*  Dialog   */}
      <>
        <dialog id="my_modal_CreateMaterial" className="modal">
          {openCreateMaterial && (
            <DialogCreateMaterail
              mateUrl={mateUrl}
              setOpenCreateMaterial={setOpenCreateMaterial}
            />
          )}
        </dialog>

        <dialog id="my_modal_UpdateStockMaterial" className="modal">
          {openUpdateStockMaterial.isOpen && (
            <DialogUpdateStockMaterial
              filterSelectMate={filterSelectMate}
              setOpenUpdateStockMaterial={setOpenUpdateStockMaterial}
            />
          )}
        </dialog>

        <dialog id="my_modal_EditMaterial" className="modal">
          {openSelectDetail.isOpen && (
            <DialogEditMaterial
              filterSelectMate={filterSelectMate}
              handleClearOpenMenuSelectDetail={handleClearOpenMenuSelectDetail}
            />
          )}
        </dialog>

        <dialog id="my_modal_DeleteMate" className="modal">
          {openDeleteMate.isOpen && (
            <DialogConfirmDelete
              sendDelete={sendDeleteBase}
              idDelete={openDeleteMate.mateId}
              handleClearOpen={handleClearOpenDeleteMate}
            />
          )}
        </dialog>
      </>
    </>
  );
}

function TableMenuMateUsed(params) {
  const { filterSelectMate } = params;
  const mateUsedUrl = `${BaseURL}${findUseByMaterialId}${filterSelectMate.mateId}`;
  const { resMenuMaterial, resLoading, resError } =
    getMenuMaterial(mateUsedUrl);

  if (resLoading) {
    return <ResLoadingScreen />;
  }

  if (resError) {
    return <ResErrorScreen />;
  }

  return (
    <>
      <div className="h-full pb-0 overflow-auto scrollerBar">
        <table className="table table-pin-rows ">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th className="w-[20%]">ประเภท</th>
              <th className="w-[40%]">รายการที่ใช้งาน</th>
              <th className="w-[15%]">หน่วยที่ใช้</th>
              <th className="w-[15%]">ปริมาณที่ใช้</th>
            </tr>
          </thead>
          <tbody>
            {resMenuMaterial?.map((e, index) => (
              <tr className="hover bg-base-100" key={index}>
                <th>{index + 1}</th>
                <td>
                  <p>
                    {e.prodBaseId
                      ? "สินค้า"
                      : e.prodFormId
                      ? "รูปแบบสินค้า"
                      : e.optionId && "ตัวเลือก"}
                  </p>
                </td>
                <th>
                  <p>
                    {e.prodBaseId
                      ? e.prodTitleTh
                      : e.prodFormId
                      ? e.prodTitleTh + " - " + e.prodFormTh
                      : e.optionId && e.addOnTitleTh + " - " + e.optionNameTh}
                  </p>
                </th>
                <th>
                  <span className="badge badge-ghost badge-sm">
                    {filterSelectMate.mateUnit}
                  </span>
                </th>
                <th>
                  <span className="badge badge-ghost badge-sm">
                    {e.amountUsed}
                  </span>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// function TableMenuMateDetail(params) {
//   const { filterSelectMate } = params;

//   const { setOnOpenToast, setResUpdateStatusState } =
//     useContext(ToastAlertContext);

//   const [dataUpdateMate, setDataUpdateMate] = useState({
//     mateName: "",
//     mateUnit: "",
//     mateId: filterSelectMate.mateId,
//   });

//   const handleMateName = (event) => {
//     setDataUpdateMate((prev) => ({
//       ...prev,
//       mateName: event.target.value,
//     }));
//   };

//   const handleMateUnit = (event) => {
//     setDataUpdateMate((prev) => ({
//       ...prev,
//       mateUnit: event.target.value,
//     }));
//   };

//   const sendUpdateMaterial = async () => {
//     if (!dataUpdateMate.mateName && !dataUpdateMate.mateUnit) {
//       return;
//     }
//     const fetcherUpdateMate = async () => {
//       let dataJson = JSON.stringify(dataUpdateMate);
//       const sendUrl = `${BaseURL}${updateMaterial}`;
//       setOnOpenToast(true);
//       setResUpdateStatusState((prev) => ({
//         ...prev,
//         isLoadingUpdate: true,
//       }));
//       let customConfig = {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       };
//       try {
//         const response = await axios.put(sendUrl, dataJson, customConfig);
//         const data = await response.data.res;
//         setResUpdateStatusState((prev) => ({
//           ...prev,
//           resUpdate: data,
//           errorUpdate: "",
//         }));
//         filterSelectMate.mateName = data.mateName;
//         filterSelectMate.mateUnit = data.mateUnit;
//       } catch (error) {
//         console.error("error : ", error);
//         setResUpdateStatusState((prev) => ({
//           ...prev,
//           resUpdate: "",
//           errorUpdate: error,
//         }));
//       } finally {
//         setResUpdateStatusState((prev) => ({
//           ...prev,
//           isLoadingUpdate: false,
//         }));
//       }
//     };
//     ////////// use
//     await fetcherUpdateMate();
//   };

//   return (
//     <div className="overflow-auto pb-[80px] h-full scrollerBar bg-base-300 ">
//       <div className="m-2 rounded-md bg-base-100 ">
//         {filterSelectMate && (
//           <div className="w-full card-body">
//             <div className="flex flex-row justify-between">
//               <div className="form-control ">
//                 <label className="label" htmlFor="mate-name">
//                   <span className="label-text">เปลี่ยนชื่อสินค้าคงคลัง</span>
//                 </label>
//                 <input
//                   id="mate-name"
//                   type="text"
//                   value={dataUpdateMate.mateName}
//                   placeholder={filterSelectMate?.mateName}
//                   className="input input-bordered"
//                   onChange={handleMateName}
//                 />
//               </div>

//               <div className="form-control ">
//                 <label className="label" htmlFor="mate-unit">
//                   <span className="label-text">เปลี่ยนหน่วย</span>
//                 </label>
//                 <input
//                   id="mate-unit"
//                   type="text"
//                   value={dataUpdateMate.mateUnit}
//                   placeholder={filterSelectMate?.mateUnit}
//                   className="input input-bordered"
//                   onChange={handleMateUnit}
//                 />
//               </div>
//             </div>
//             <div className="justify-end pt-1 card-actions">
//               <button
//                 className="btn btn-primary"
//                 onClick={() => sendUpdateMaterial()}
//               >
//                 บันทัก
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

const fetcherMenuMaterial = (url) => axios.get(url).then((res) => res.data.res);
const getMenuMaterial = (url) => {
  const { data, error, isLoading, mutate } = useSWR(url, fetcherMenuMaterial, {
    revalidateOnFocus: false,
  });
  return {
    resMenuMaterial: data,
    resLoading: isLoading,
    resError: error,
    resMutate: mutate,
  };
};
