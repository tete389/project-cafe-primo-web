/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */

import "../style/store.css";

import { useContext, useEffect, useState } from "react";
import DiscountBox from "./DiscountBox";
import NoteBox from "./NoteBox";
import {
  BasketValueContext,
  LanguageContext,
  OrderValueContext,
} from "../pages/customer/Store";

export default function BasketPopup(props) {
  const {
    handleOpenBasket,
    sendCreateOrder,
    handleEditMenuPopup,
    handleMenuEdit,
  } = props;

  const { basketValue, setBasketValue, setingShopData } =
    useContext(BasketValueContext);
  const { orderValue, setOrderValue } = useContext(OrderValueContext);
  const userLanguage = useContext(LanguageContext);

  const [openBox, setOpenBox] = useState({ box1: false, box2: false });
  let discountPoint = 0;
  const [orderPriceAll, setOrderPriceAll] = useState(0);
  // const [createOrder, setCreateOrder] = useState({
  //   note: "",
  //   discount: {
  //     phoneNumber: "",
  //     spendPoint: 0,
  //   },
  //   prodRequests: [],
  // });

  const deleteOrder = (itemId) => {
    const toDelete = basketValue?.menu?.filter((bv) => bv.itemId !== itemId);
    setBasketValue({
      menu: toDelete,
    });
  };

  const handleCreateDiscount = (value) => {
    setOrderValue((prev) => ({
      ...prev,
      discount: value,
    }));
  };

  const handleCreateprodRequsts = (value) => {
    setOrderValue((prev) => ({
      ...prev,
      prodRequests: value,
    }));
  };

  ///////////////////
  useEffect(() => {
    setOrderValue((prev) => ({
      // note: "",
      ...prev,
      discount: {
        phoneNumber: "",
        spendPoint: 0,
      },
      prodRequests: [],
    }));
  }, []);

  ////////
  useEffect(() => {
    setOrderPriceAll(0);
    const price = basketValue?.menu?.reduce((sum, number) => {
      return sum + (number.formPrice + number.optionsPrice) * number.count;
    }, 0);
    setOrderPriceAll((prev) => prev + price);
    let prods = [];
    basketValue?.menu?.forEach((e) => {
      prods = [
        ...prods,
        {
          prodFormId: e.formId,
          quantity: e.count,
          options: e.options?.map((opt) => ({ optionId: opt.optionId })),
        },
      ];
    });
    handleCreateprodRequsts(prods);
  }, [basketValue]);

  discountPoint =
    orderValue?.discount?.spendPoint / setingShopData?.pointSpendRate;

  return (
    <div className="w-screen md:w-[30rem] h-screen">
      <header className="w-full bg-base-100">
        <div className="flex items-center justify-between text-base-content">
          <p className="p-2 text-4xl stat-value">
            {" "}
            {userLanguage === "th" ? "ตะกร้า" : "Basket"}
          </p>
          <button
            className=" btn btn-circle btn-link"
            onClick={() => handleOpenBasket(false)}
          >
            <box-icon
              name="x"
              color="hsl(var(--bc) / var(--tw-text-opacity))"
            ></box-icon>
          </button>
        </div>
      </header>

      <main className="flex flex-col h-full overflow-y-scroll pb-[16rem] bg-base-300 pt-2 scrollerBar">
        {basketValue &&
          basketValue?.menu?.map((bv) => (
            <div
              key={bv.itemId}
              className="mx-2 mb-3 shadow-md card bg-base-100 text-base-content"
            >
              <button
                className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
                onClick={() => deleteOrder(bv.itemId)}
              >
                <box-icon
                  name="trash-alt"
                  type="solid"
                  color="hsl(var(--bc) / var(--tw-text-opacity))"
                ></box-icon>
              </button>
              <div className="card-body ">
                <p className="card-title">
                  {userLanguage === "th"
                    ? bv.baseNameTh + " " + bv.formNameTh
                    : bv.baseNameEng + " " + bv.formNameEng}
                </p>

                <div className=" collapse collapse-arrow join-item">
                  <input
                    type="checkbox"
                    name="my-accordion-4"
                    defaultChecked={false}
                    className="h-10 min-h-0"
                  />
                  <div className="flex items-center h-10 min-h-0 text-xl font-medium opacity-50 collapse-title">
                    {userLanguage === "th" ? "รายละเอียด" : "detail"}
                  </div>
                  <div className="collapse-content">
                    <div className="flex justify-between">
                      <p>
                        {userLanguage === "th"
                          ? bv.baseNameTh + " " + bv.formNameTh
                          : bv.baseNameEng + " " + bv.formNameEng}
                      </p>
                      <p className="text-end">{bv.formPrice}</p>
                    </div>
                    {bv.options?.map((opv, index) => (
                      <div key={index} className="flex justify-between">
                        <p>
                          {userLanguage === "th"
                            ? opv.optionNameTh
                            : opv.optionNameEng}
                        </p>
                        <p className="text-end">{opv.price}</p>
                      </div>
                    ))}
                    <div className="flex justify-start">
                      <button
                        className=" btn btn-link btn-xs"
                        onClick={() => {
                          handleEditMenuPopup(true);
                          handleMenuEdit(bv.itemId);
                        }}
                      >
                        <box-icon
                          name="edit"
                          type="solid"
                          color="rgb(100 116 139)"
                        ></box-icon>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-actions">
                  <p className="text-2xl">x {bv.count}</p>
                  <p className="text-2xl text-end">
                    ฿ {(bv.formPrice + bv.optionsPrice) * bv.count}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </main>
      <footer className="absolute bottom-0 flex flex-col items-center w-full gap-2 py-2 justify-evenly bg-base-100">
        <div className="w-full">
          <article className="flex flex-row items-center justify-between mx-5 mb-1">
            <aside
              className={`w-full bg-white border shadow-md collapse collapse-arrow join-item border-base-300`}
            >
              <input
                type="checkbox"
                name="my-accordion-1"
                className="h-10 min-h-0"
                checked={openBox.box1}
                onChange={() =>
                  setOpenBox((prev) => ({
                    ...prev,
                    box1: !prev.box1,
                  }))
                }
              />
              <div className="flex items-center justify-between h-10 min-h-0 collapse-title text-slate-500">
                <box-icon
                  type="solid"
                  name="note"
                  color="rgb(100 116 139 / var(--tw-text-opacity))"
                ></box-icon>

                {orderValue?.note ? (
                  <p className="w-1/2 font-medium ">
                    {userLanguage === "th"
                      ? "บันทึกข้อความแล้ว "
                      : "Note Saved"}
                  </p>
                ) : (
                  <p className="w-1/2 font-medium ">
                    {" "}
                    {userLanguage === "th" ? "เพิ่มข้อความ " : "Add Note"}
                  </p>
                )}
              </div>
              <div className="collapse-content">
                <NoteBox setOpenBox={setOpenBox} />
              </div>
            </aside>
          </article>
          <article className="flex flex-row items-center justify-between mx-5 ">
            <aside
              className={`w-full bg-white border shadow-md collapse collapse-arrow join-item border-base-300`}
            >
              <input
                type="checkbox"
                name="my-accordion-2"
                className="h-10 min-h-0"
                checked={openBox.box2}
                onChange={() =>
                  setOpenBox((prev) => ({
                    ...prev,
                    box2: !prev.box2,
                  }))
                }
              />
              <div className="flex items-center justify-between h-10 min-h-0 collapse-title text-slate-500">
                <box-icon
                  type="solid"
                  name="purchase-tag"
                  color="rgb(100 116 139 / var(--tw-text-opacity))"
                ></box-icon>
                {orderValue?.discount?.spendPoint !== 0 ? (
                  <p className="w-1/2 font-medium ">
                    {userLanguage === "th" ? "ส่วนลด " : "Discount "}{" "}
                    {discountPoint}
                  </p>
                ) : (
                  <p className="w-1/2 font-medium ">
                    {" "}
                    {userLanguage === "th" ? "เพิ่มส่วนลด " : "Add Discount "}
                  </p>
                )}
              </div>
              <div className="collapse-content ">
                <DiscountBox
                  setingShopData={setingShopData}
                  handleCreateDiscount={handleCreateDiscount}
                  setOpenBox={setOpenBox}
                />
              </div>
            </aside>
          </article>
        </div>

        <article className="flex flex-row justify-between w-11/12 ">
          <p className="text-4xl text-base-content stat-value">
            {" "}
            {userLanguage === "th" ? "รวมราคา" : "Total Price"}
          </p>
          {orderValue?.discount?.spendPoint !== 0 ? (
            <p className="text-4xl font-medium text-cyan-500">
              {orderPriceAll - discountPoint}{" "}
            </p>
          ) : (
            <p className="text-4xl text-base-content stat-value">
              {" "}
              {orderPriceAll}{" "}
            </p>
          )}
        </article>
        <button
          className="w-11/12 text-2xl text-white shadow-md btn btn-info bg-sky-500 "
          onClick={() => sendCreateOrder()}
        >
          {userLanguage === "th" ? "ยันยืนการสั่งซื้อ" : "Confirm Order"}
        </button>
      </footer>
    </div>
  );
}

// const fetcher = (url) => axios.post(url).then((res) => res.data.res);
// const getDiscountPoint = (phoneNumber) => {
//   const { data, error, isLoading } = useSWR(
//     `${BaseURL}${findPoint}${phoneNumber}`,
//     fetcher,
//     {
//       revalidateIfStale: false,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: false,
//     }
//   );

//   return {
//     pointData: data,
//     isLoading,
//     isError: error,
//   };
// };
