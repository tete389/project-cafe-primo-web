/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useState } from "react";
import "../../style/emp.css";
import {
  BaseURL,
  deleteCategory,
  findCategoryAll,
  findProductBaseByCategoryId,
  updateCategory,
} from "../../service/BaseURL";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { ToastAlertContext } from "./EmployeeLayout";
import ResLoadingScreen from "../../components/ResLoadingScreen";
import ResErrorScreen from "../../components/ResErrorScreen";
import DialogCreateCategory from "../../components/DialogCreateCategory";
import DialogEditCategory from "../../components/DialogEditCategory";
import DialogConfirmDelete from "../../components/DialogConfirmDelete";

export default function MenuCategory() {
  const cateUrl = `${BaseURL}${findCategoryAll}`;
  const { resMenuCategory, resLoading, resError } = getMenuCategory(cateUrl);

  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const [openMenuSelectDetail, setOpenMenuSelectDetail] = useState({
    isOpen: false,
    cateIdOpen: "",
    cateNameOpen: "",
  });

  const [openMenuSelectConnect, setOpenMenuSelectConnect] = useState({
    isOpen: false,
    cateIdOpen: "",
    cateNameOpen: "",
  });

  const [openCreateCategory, setOpenCreateCategory] = useState(false);

  const [openDeleteCategory, setOpenDeleteCategory] = useState({
    isOpen: false,
    cateId: "",
  });

  const handleOpenMenuSelectDetail = (cateId, cateName) => {
    setOpenMenuSelectDetail({
      isOpen: true,
      cateIdOpen: cateId,
      cateNameOpen: cateName,
    });
  };

  const handleClearOpenMenuSelectDetail = () => {
    setOpenMenuSelectDetail({
      isOpen: false,
      cateIdOpen: "",
      cateNameOpen: "",
    });
  };

  const handleOpenMenuSelectConnect = (cateId, cateName) => {
    setOpenMenuSelectConnect({
      isOpen: true,
      cateIdOpen: cateId,
      cateNameOpen: cateName,
    });
  };

  const handleClearOpenMenuSelectConnect = () => {
    setOpenMenuSelectConnect({
      isOpen: false,
      cateIdOpen: "",
      cateNameOpen: "",
    });
  };

  const handleOpenCreateCate = () => {
    setOpenCreateCategory(true);
    window.my_modal_CreateCategory.showModal();
  };

  const handleOpenDeleteCate = (cateId) => {
    setOpenDeleteCategory({ isOpen: true, cateId: cateId });
    window.my_modal_DeleteCategory.showModal();
  };

  const handleClearOpenDeleteCategory = () => {
    setOpenDeleteCategory({
      isOpen: false,
      cateId: "",
    });
  };

  if (resLoading) {
    return <ResLoadingScreen />;
  }

  if (resError) {
    return <ResErrorScreen />;
  }

  const filterSelectCate = resMenuCategory?.find((e) => {
    return (
      e.cateId === openMenuSelectDetail.cateIdOpen ||
      e.cateId === openMenuSelectConnect.cateIdOpen
    );
  });

  const sendDeleteCate = async (cateId) => {
    const fetcherDeleteCate = async () => {
      let dataJson = JSON.stringify({
        cateId: cateId,
      });

      const sendUrl = `${BaseURL}${deleteCategory}`;
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
        mutate(cateUrl);
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
    await fetcherDeleteCate();
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between h-12 p-2 mt-1 rounded-t-md bg-base-200">
        <div className="text-2xl font-extrabold text-base-content breadcrumbs ">
          <ul>
            {openMenuSelectConnect.isOpen ? (
              <>
                <li onClick={handleClearOpenMenuSelectConnect}>
                  <a className="underline">รายการหมวดหมู่สินค้า</a>
                </li>
                {openMenuSelectConnect?.cateNameOpen && (
                  <li className="pr-2">{openMenuSelectConnect.cateNameOpen}</li>
                )}
              </>
            ) : (
              <li className="pr-2">รายการหมวดหมู่สินค้า</li>
            )}
          </ul>
        </div>
      </div>

      {openMenuSelectConnect.isOpen ? (
        <div className={`h-full overflow-hidden rounded-b-md bg-base-200  `}>
          <TableMenuCategoryConnect filterSelectCate={filterSelectCate} />
        </div>
      ) : (
        <></>
      )}

      <div
        className={`h-full overflow-hidden rounded-b-md bg-base-200  ${
          openMenuSelectConnect.isOpen && `hidden`
        } `}
      >
        <TableMenuCategory
          resMenuCategory={resMenuCategory}
          handleOpenMenuSelectDetail={handleOpenMenuSelectDetail}
          handleOpenMenuSelectConnect={handleOpenMenuSelectConnect}
          handleOpenCreateCate={handleOpenCreateCate}
          handleOpenDeleteCate={handleOpenDeleteCate}
        />
      </div>

      {/*  Dialog   */}
      <>
        <dialog id="my_modal_CreateCategory" className="modal">
          {openCreateCategory && (
            <DialogCreateCategory
              cateUrl={cateUrl}
              setOpenCreateCategory={setOpenCreateCategory}
            />
          )}
        </dialog>

        <dialog id="my_modal_EditCategory" className="modal">
          {openMenuSelectDetail.isOpen && (
            <DialogEditCategory
              filterSelectCate={filterSelectCate}
              handleClearOpenMenuSelectDetail={handleClearOpenMenuSelectDetail}
            />
          )}
        </dialog>

        <dialog id="my_modal_DeleteCategory" className="modal">
          {openDeleteCategory.isOpen && (
            <DialogConfirmDelete
              sendDelete={sendDeleteCate}
              idDelete={openDeleteCategory.cateId}
              handleClearOpen={handleClearOpenDeleteCategory}
            />
          )}
        </dialog>
      </>
    </>
  );
}

function TableMenuCategoryConnect(params) {
  const { filterSelectCate } = params;
  const cateConnectUrl = `${BaseURL}${findProductBaseByCategoryId}${filterSelectCate?.cateId}`;
  const { resMenuCategory, resLoading, resError } =
    getMenuCategory(cateConnectUrl);

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
              <th className="w-[40%]">รายการสินค้าที่เกี่ยวข้อง</th>

              <th className="w-[40%]"></th>
            </tr>
          </thead>
          <tbody>
            {resMenuCategory?.map((e, index) => (
              <tr className="hover bg-base-100" key={index}>
                <th>{index + 1}</th>
                <td>
                  <p>{e.prodTitleTh}</p>
                  <p>{e.prodTitleEng}</p>
                </td>
                <th></th>
                {/* <th>
                  <span className="badge badge-ghost badge-sm">
                    {filterSelectMate.mateUnit}
                  </span>
                </th>
                <th>
                  <span className="badge badge-ghost badge-sm">
                    {e.amountUsed}
                  </span>
                </th> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function TableMenuCategory(params) {
  const {
    resMenuCategory,
    handleOpenMenuSelectDetail,
    handleOpenMenuSelectConnect,
    handleOpenCreateCate,
    handleOpenDeleteCate,
  } = params;

  return (
    <>
      <div className="h-full pb-0 overflow-auto scrollerBar">
        <table className="table table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <th className="w-[5%]"></th>
              <th className="w-[25%]">ชื่อหมวดหมู่</th>
              <th className="w-[20%] text-center">สินค้าที่เกี่ยวข้อง</th>
              <th className="w-[15%] text-center">สถานะ</th>
              <th className="w-[15%] text-end">
                <button
                  className=" btn btn-xs btn-outline btn-primary"
                  onClick={() => handleOpenCreateCate()}
                >
                  เพิ่มหมวดหมู่
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {resMenuCategory?.map((e, index) => (
              <TaBlePanal
                key={e.cateId}
                index={index}
                resCate={e}
                handleOpenMenuSelectDetail={handleOpenMenuSelectDetail}
                handleOpenMenuSelectConnect={handleOpenMenuSelectConnect}
                handleOpenDeleteCate={handleOpenDeleteCate}
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
    resCate,
    handleOpenMenuSelectDetail,
    handleOpenMenuSelectConnect,
    handleOpenDeleteCate,
  } = params;
  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const handleDetail = () => {
    handleOpenMenuSelectDetail(resCate.cateId, resCate.cateNameTh);
    window.my_modal_EditCategory.showModal();
  };

  const sendUpdateStatusCate = async (cateId, isEnable) => {
    const fetcherUpdateCate = async () => {
      let dataJson = JSON.stringify({
        cateId: cateId,
        isEnable: !isEnable,
      });
      const sendUrl = `${BaseURL}${updateCategory}`;
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
        resCate.isEnable = data.isEnable;
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
    await fetcherUpdateCate();
  };

  return (
    <tr className="hover bg-base-100">
      <th>{index + 1}</th>
      <td className="flex items-center justify-between ">
        <div className="w-5/6">
          <p>{resCate.cateNameTh}</p>
          <p>{resCate.cateNameEng}</p>
        </div>
      </td>

      <td className="text-center">
        <button
          className="btn btn-xs"
          onClick={() =>
            handleOpenMenuSelectConnect(resCate.cateId, resCate.cateNameTh)
          }
        >
          ดูรายละเอียด
        </button>
      </td>
      <td className="text-center rounded-l-md">
        <label className="w-24 px-0 cursor-pointer label text-end" htmlFor={resCate.cateId}>
          <span className="label-text ">
            {resCate.isEnable ? "เปิด" : "ปิด"}
          </span>
          <input
            id={resCate.cateId}
            type="checkbox"
            className="toggle toggle-success toggle-sm"
            checked={resCate.isEnable}
            onChange={() =>
              sendUpdateStatusCate(resCate.cateId, resCate.isEnable)
            }
          />
        </label>
      </td>
      <td className="text-end ">
        <div className="join">
          <button
            className="btn btn-warning btn-sm text-base-100 join-item"
            onClick={() => handleDetail()}
          >
            <span>แก้ไข</span>
          </button>
          <button
            className="btn btn-error btn-sm text-base-100 join-item"
            onClick={() => handleOpenDeleteCate(resCate.cateId)}
          >
            <span>ลบ</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

// function TableMenuCateDetail(params) {
//   const { filterSelectCate } = params;

//   const { setOnOpenToast, setResUpdateStatusState } =
//     useContext(ToastAlertContext);

//   const [dataUpdateCate, setDataUpdateCate] = useState({
//     cateNameTh: "",
//     cateNameEng: "",
//     isRecommend: filterSelectCate.isRecommend,
//     cateId: filterSelectCate?.cateId,
//   });

//   const handleCateNameTh = (event) => {
//     setDataUpdateCate((prev) => ({
//       ...prev,
//       cateNameTh: event.target.value,
//     }));
//   };

//   const handleCateNameEng = (event) => {
//     setDataUpdateCate((prev) => ({
//       ...prev,
//       cateNameEng: event.target.value,
//     }));
//   };

//   const handleCateIsRecommend = (event) => {
//     setDataUpdateCate((prev) => ({
//       ...prev,
//       isRecommend: event.target.checked,
//     }));
//   };

//   const sendUpdateCategory = async () => {
//     if (
//       !dataUpdateCate.cateNameTh &&
//       !dataUpdateCate.cateNameEng &&
//       dataUpdateCate.isRecommend === filterSelectCate.isRecommend
//     ) {
//       return;
//     }
//     const fetcherUpdateMate = async () => {
//       let dataJson = JSON.stringify(dataUpdateCate);
//       const sendUrl = `${BaseURL}${updateCategory}`;
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
//         filterSelectCate.cateNameTh = data.cateNameTh;
//         filterSelectCate.cateNameEng = data.cateNameEng;
//         filterSelectCate.isRecommend = data.isRecommend;
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
//         {filterSelectCate && (
//           <div className="w-full card-body">
//             <div className="flex flex-row justify-between">
//               <div className="form-control ">
//                 <label className="label" htmlFor="cate-name-th">
//                   <span className="label-text">
//                     เปลี่ยนชื่อหมวดหมู่สินค้า - ไทย
//                   </span>
//                 </label>
//                 <input
//                   id="cate-name-th"
//                   type="text"
//                   value={dataUpdateCate.cateNameTh}
//                   placeholder={filterSelectCate?.cateNameTh}
//                   className="input input-bordered"
//                   onChange={handleCateNameTh}
//                 />
//               </div>

//               <div className="form-control ">
//                 <label className="label" htmlFor="cate-name-eng">
//                   <span className="label-text">
//                     เปลี่ยนชื่อหมวดหมู่สินค้า - อังกฤษ
//                   </span>
//                 </label>
//                 <input
//                   id="cate-name-eng"
//                   type="text"
//                   value={dataUpdateCate.cateNameEng}
//                   placeholder={filterSelectCate?.cateNameEng}
//                   className="input input-bordered"
//                   onChange={handleCateNameEng}
//                 />
//               </div>
//             </div>

//             <div className="justify-between pt-1 card-actions">
//               <div className="form-control">
//                 <label
//                   className="pt-0 cursor-pointer label"
//                   htmlFor={filterSelectCate.cateId}
//                 >
//                   <span className="label-text ">
//                     หมวดหมู่แนะนำ :{" "}
//                     {filterSelectCate.isRecommend ? "เปิดอยู่" : "ปิด"}
//                   </span>
//                 </label>
//                 <input
//                   id={filterSelectCate.cateId}
//                   type="checkbox"
//                   className="toggle toggle-success toggle-sm"
//                   checked={dataUpdateCate.isRecommend}
//                   onChange={handleCateIsRecommend}
//                 />
//               </div>
//               <button
//                 className="btn btn-primary"
//                 onClick={() => sendUpdateCategory()}
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

// function ProdAddCategory(params) {
//   const url = `${BaseURL}${findProductBaseByCategoryId}${cateId}`;
//   const { resMenuProduct, resLoading, resError, resMutate } =
//     getMenuProductAll(url);
//   const { mutate } = useSWRConfig();

//   const {} = params;
//   return (
//     <div className="mt-2 overflow-x-auto rounded-md bg-base-100">
//       <table className="table">
//         {/* head */}
//         <thead>
//           <tr>
//             <th className="w-[70%]">ชื่อสินค้า</th>
//             <th className="w-[30%]">
//               {isLoadingUpdate && <progress className=" progress"></progress>}
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {resMenuProduct?.map((e) => (
//             <tr key={e.prodBaseId}>
//               <td>
//                 <div className="flex items-center space-x-3">
//                   <div className="font-bold">{e.prodTitle}</div>
//                   {/* <div className="text-sm opacity-50">count form</div> */}
//                 </div>
//               </td>
//               <th className="text-end">
//                 <button
//                   className="btn btn-ghost btn-active"
//                   disabled={isLoadingUpdate}
//                   onClick={() => sendManageProduct(e.prodBaseId)}
//                 >
//                   <box-icon name="log-out" rotate="90"></box-icon>
//                   <span>นำออก</span>
//                 </button>
//               </th>
//             </tr>
//           ))}

//           {/* <tr>
//           <th>2</th>
//         </tr> */}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function ProdOutCategory(params) {
//   const { isLoadingUpdate, resMenuProduct, sendManageProduct } = params;
//   return (
//     <div className="mt-2 overflow-x-auto rounded-md bg-base-100">
//       <table className="table">
//         {/* head */}
//         <thead>
//           <tr>
//             <th className="w-[70%]">ชื่อสินค้า</th>
//             <th className="w-[30%]">
//               {isLoadingUpdate && <progress className=" progress"></progress>}
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {resMenuProduct?.map((e) => (
//             <tr key={e.prodBaseId}>
//               <td>
//                 <div className="flex items-center space-x-3">
//                   <div className="font-bold">{e.prodTitle}</div>
//                   {/* <div className="text-sm opacity-50">count form</div> */}
//                 </div>
//               </td>
//               {/* <th className="text-end">
//                 <button
//                   className="btn btn-ghost btn-active"
//                   disabled={isLoadingUpdate}
//                   onClick={() => sendManageProduct(e.prodBaseId)}
//                 >
//                   <box-icon name="log-out" rotate="90"></box-icon>
//                   <span>นำออก</span>
//                 </button>
//               </th> */}
//             </tr>
//           ))}

//           {/* <tr>
//           <th>2</th>
//         </tr> */}
//         </tbody>
//       </table>
//     </div>
//   );
// }

const fetcherMenuMaterial = (url) => axios.get(url).then((res) => res.data.res);
const getMenuCategory = (url) => {
  const { data, error, isLoading, mutate } = useSWR(url, fetcherMenuMaterial, {
    revalidateOnFocus: false,
  });
  return {
    resMenuCategory: data,
    resLoading: isLoading,
    resError: error,
    resMutate: mutate,
  };
};

// const fetcherMenuProductCategory = (url) =>
//   axios.get(url).then((res) => res.data.res);
// const getMenuProductByCategory = (url) => {
//   const { data, error, isLoading, mutate } = useSWR(
//     url,
//     fetcherMenuProductCategory,
//     {
//       revalidateOnFocus: false,
//     }
//   );
//   return {
//     resMenuProduct: data,
//     resLoading: isLoading,
//     resError: error,
//     resMutate: mutate,
//   };
// };

// const fetcherMenuProductAdd = (url) =>
//   axios.get(url).then((res) => res.data.res);
// const getMenuProductAll = (url) => {
//   const { data, error, isLoading, mutate } = useSWR(
//     url,
//     fetcherMenuProductAdd,
//     {
//       revalidateOnFocus: false,
//     }
//   );
//   return {
//     resMenuProduct: data,
//     resLoading: isLoading,
//     resError: error,
//     resMutate: mutate,
//   };
// };
