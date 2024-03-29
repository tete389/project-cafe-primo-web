import { useContext } from "react";
import axios from "axios";
// import { useSWRConfig } from "swr";
import { BaseURL, updateProductBase } from "../service/BaseURL";
import { ToastAlertContext } from "../pages/employee/EmployeeLayout";

export default function TableMenuProduct(params) {
  const {
    handleOpenMenuSelect,
    handleOpenMenuSelectForm,
    resMenuProduct,
    handleOpenCreateProduct,
    handleOpenDeleteBaseProduct,
  } = params;

  return (
    <>
      <div className="h-full pb-0 overflow-x-auto scrollerBar">
        <table className="table table-pin-rows ">
          {/* head */}
          <thead>
            <tr>
              <th className="w-[5%] ">ลำดับ</th>
              <th ></th>
              <th className="w-[15%] ">ชื่อสินค้า</th>
              <th className="w-[15%] text-center">รูปแบบสินค้า</th>
              <th className="w-[15%] text-center">สถานะ</th>
              <th className="w-[30%] text-end">
                <button
                  className=" btn btn-xs btn-outline btn-primary"
                  onClick={() => handleOpenCreateProduct()}
                >
                  เพิ่มสินค้า
                </button>
              </th>
            </tr>
          </thead>
          {/* body */}
          <tbody>
            {resMenuProduct?.map((e, index) => (
              <TaBlePanal
                key={e.prodBaseId}
                index={index}
                productBase={e}
                handleOpenMenuSelect={handleOpenMenuSelect}
                handleOpenMenuSelectForm={handleOpenMenuSelectForm}
                handleOpenDeleteBaseProduct={handleOpenDeleteBaseProduct}
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
    productBase,
    handleOpenMenuSelect,
    handleOpenMenuSelectForm,
    handleOpenDeleteBaseProduct,
  } = params;

  // const { mutate } = useSWRConfig();
  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const sendUpdateStatusProduct = async (prodId, isEnable) => {
    const fetcherUpdateProd = async () => {
      let dataJson = JSON.stringify({
        prodBaseId: prodId,
        isEnable: !isEnable,
      });

      const sendUrl = `${BaseURL}${updateProductBase}`;
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
        // mutate(prodBaseUrl);
        productBase.isEnable = data.isEnable;
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
    <tr className="hover bg-base-100">
      <th>{index + 1}</th>
      <td>
        <img
          className="object-cover w-16 h-14"
          src={` ${
            productBase.image === "none"
              ? "/images/cafe_image3.jpg"
              : `${productBase.image}`
          }`}
          alt="cafe"
        />
      </td>
      <td className="flex items-center justify-between">
        <div className="w-5/6">
          <p>{productBase.prodTitleTh}</p>
          <p>{productBase.prodTitleEng}</p>
        </div>
        {/* <button
          onClick={() => {
            handleOpenMenuSelect(
              productBase.prodBaseId,
              productBase.prodTitleTh
            ),
              window.my_modal_EditProduct.showModal();
          }}
        >
          <box-icon
            name="edit"
            type="solid"
            size="sm"
            color="hsl(var(--wa) / var(--tw-bg-opacity))"
          ></box-icon>
        </button> */}
      </td>
      <td
        className="text-center"
        // onClick={() =>
        //   handleOpenMenuSelectForm(
        //     productBase.prodBaseId,
        //     productBase.prodTitleTh
        //   )
        // }
      >
        <div className="items-center ">
          {/* {productBase.formsName?.map((form, index) => (
            <span key={index} className="badge badge-ghost badge-sm">
              {form}
            </span>
          ))} */}
          <p>
          {productBase?.fromCount}

          </p>
        </div>
        {/* <button
          className="btn btn-xs"
          onClick={() =>
            handleOpenMenuSelectForm(
              productBase.prodBaseId,
              productBase.prodTitleTh
            )
          }
        >
          รายละเอียด
        </button> */}
      </td>

      <td className="text-right rounded-l-md">
        <label
          className="px-0 cursor-pointer w-28 label"
          htmlFor={productBase.prodBaseId}
        >
          <span className="label-text ">
            {productBase.isMaterialEnable
              ? productBase.isEnable
                ? "เปิดขาย"
                : "ปิด"
              : "ปิดโดยคงคลัง"}
          </span>
          <input
            id={productBase.prodBaseId}
            type="checkbox"
            className={
              productBase.isMaterialEnable
                ? `toggle toggle-success toggle-sm`
                : `toggle toggle-sm`
            }
            checked={productBase.isEnable}
            disabled={!productBase?.isMaterialEnable}
            onChange={() =>
              sendUpdateStatusProduct(
                productBase.prodBaseId,
                productBase.isEnable
              )
            }
          />
        </label>
      </td>

      <th className="text-end">
        <div className="join">
          <button
            className="btn btn-warning btn-sm join-item text-base-100"
            onClick={() => {
              handleOpenMenuSelect(
                productBase.prodBaseId,
                productBase.prodTitleTh,
                0
              ),
                window.my_modal_EditProduct.showModal();
            }}
          >
            <span>แก้ไข</span>
          </button>
          <button
            className="btn btn-info btn-sm join-item text-base-100"
            onClick={() => {
              handleOpenMenuSelect(
                productBase.prodBaseId,
                productBase.prodTitleTh,
                1
              ),
                window.my_modal_EditProduct.showModal();
            }}
          >
            <span>รูปแบบสินค้า</span>
          </button>
          <button
            className="btn btn-error btn-sm text-base-100 join-item"
            onClick={() => handleOpenDeleteBaseProduct(productBase.prodBaseId)}
          >
            <span>ลบ</span>
          </button>
        </div>
      </th>
    </tr>
  );
}
