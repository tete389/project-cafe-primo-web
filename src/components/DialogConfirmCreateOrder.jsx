import { useContext, useEffect, useState } from "react";

import axios from "axios";
import { BaseURL, requestOrder } from "../service/BaseURL";
import {
  BasketValueContext,
  LanguageContext,
  OrderValueContext,
  ToastContext,
} from "../pages/customer/Store";

export default function DialogConfirmCreateOrder(params) {
  const { setOpenDialogConfirmOrder, handleOpenBasket, setfollowOrder } =
    params;

  const { basketValue, setBasketValue } = useContext(BasketValueContext);
  const { orderValue, setOrderValue } = useContext(OrderValueContext);
  const { setResUpdateStatusState, setOnOpenToast } = useContext(ToastContext);
  const userLanguage = useContext(LanguageContext);

  const [resState, setResState] = useState({
    // res: "",
    // error: "",
    isLoading: false,
  });

  const [textCustomerName, setTextCustomerName] = useState(
    orderValue.customerPhone || ""
  );

  const [textCustomerPhoneNumber, setTextCustomerPhoneNumber] = useState(
    orderValue.customerName || ""
  );

  const handleTextCustomerName = (event) => {
    setTextCustomerName(event.target.value);
  };

  const handleTextCustomerPhone = (event) => {
    if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
      setTextCustomerPhoneNumber(event.target.value);
    }
  };

  /////////  fetcher /////////
  const confirmCreateOrder = () => {
    let addName = orderValue;

    addName = {
      ...addName,
      customerName: textCustomerName,
      note: addName.note ? addName.note : "",
      collect: {
        phoneNumber: textCustomerPhoneNumber,
        collectPoint: textCustomerPhoneNumber ? orderValue.orderPriceAll : 0,
      },
    };

    // setCustomerNameAndCheckNote();

    let dataJson = JSON.stringify(addName);
    let customConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const fetcherResOrder = async () => {
      setResState((prev) => ({
        ...prev,
        isLoading: true,
      }));

      setResUpdateStatusState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      try {
        const response = await axios.post(
          `${BaseURL}${requestOrder}`,
          dataJson,
          customConfig
        );
        const data = await response.data.res;
        setResUpdateStatusState({ res: data, error: "" });
        handleSuccessCreateOrder();
        handleSaveFollowOrder(data);
      } catch (error) {
        console.error("error : ", error);
        setResUpdateStatusState({ res: "", error: error });
      } finally {
        setResState((prev) => ({
          ...prev,
          isLoading: false,
        }));
        setResUpdateStatusState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };
    setOnOpenToast(true);
    if (basketValue.menu.length > 0) {
      fetcherResOrder();
    }
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      setOpenDialogConfirmOrder(false);
    }, 200);
  };

  const handleSuccessCreateOrder = () => {
    timeToOut = setTimeout(() => {
      setOpenDialogConfirmOrder(false);
      handleOpenBasket(false);
      setBasketValue({
        menu: [],
      });
      setOrderValue({});
      document.getElementById("my_modal_confirmCreateOrder").close();
      // confirmCreateOrder();
    }, 300);
  };

  const handleSaveFollowOrder = (data) => {
    let orderDateTime = [];
    if (data.orderDate) {
      const originalString = data.orderDate;
      orderDateTime = originalString?.split(" ");
    }

    let follow = [];
    const followOrderStorage = localStorage.getItem("followOrder");
    if (followOrderStorage > 0 || followOrderStorage) {
      const followOrder = JSON.parse(followOrderStorage);
      // const currentTh = new Date(
      //   new Date().toLocaleString("en-US", {
      //     timeZone: "Asia/Bangkok",
      //   })
      // );
      // const year = currentTh.getFullYear();
      // const month = (currentTh.getMonth() + 1).toString().padStart(2, "0");
      // const day = currentTh.getDate().toString().padStart(2, "0");
      // const date = `${year}-${month}-${day}`;
      const currentTh1 = new Date().toLocaleDateString("en-US", {
        timeZone: "Asia/Bangkok",
      });

      const toDateTh1 = currentTh1.split("/");
      const dateTh1 = `${toDateTh1[2]}-${
        toDateTh1[0].length === 1 ? "0" + toDateTh1[0] : toDateTh1[0]
      }-${toDateTh1[1].length === 1 ? "0" + toDateTh1[1] : toDateTh1[1]}`;

      if (dateTh1 === followOrder[0]?.orderDateTime) {
        follow = [
          ...followOrder,
          {
            orderId: data.orderId,
            orderNumber: data.orderNumber,
            orderDateTime: orderDateTime[0],
          },
        ];
      } else {
        follow = [
          {
            orderId: data.orderId,
            orderNumber: data.orderNumber,
            orderDateTime: orderDateTime[0],
          },
        ];
      }
    } else {
      follow = [
        {
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          orderDateTime: orderDateTime[0],
        },
      ];
    }
    localStorage.setItem("followOrder", JSON.stringify(follow));
    setfollowOrder(follow);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, [timeToOut]);

  return (
    <>
      <div className="modal-box ">
        <div className="flex flex-row justify-between">
          <h3 className="text-lg font-bold">
            {" "}
            {userLanguage === "th" ? "ยันยืนการสั่งซื้อ" : "Confirm Order"}
          </h3>
          <form method="dialog">
            <button onClick={() => handleOnClose()}>
              <box-icon
                type="solid"
                color="hsl(var(--bc) / var(--tw-bg-opacity))"
                name="x-circle"
              ></box-icon>
            </button>
          </form>
        </div>

        {/* <p className="py-4 ">
          {" "}
          {userLanguage === "th"
            ? "คุณต้องการยืนยันการสั่งซื้อสินค้าหรือไม่"
            : "Do you want to confirm your order?"}
        </p> */}

        <div className="w-full max-w-xs form-control">
          <label className="label">
            <span className="text-lg label-text">
              {userLanguage === "th"
                ? "ชื่อเล่นของคุณ"
                : "What is your nickname?"}
            </span>
          </label>

          <input
            type="text"
            className="w-full max-w-xs input input-bordered"
            value={textCustomerName}
            onChange={handleTextCustomerName}
          />

          <label className="label">
            <span className="label-text-alt ">
              {userLanguage === "th" ? (
                <>
                  <span className="text-red-600">ไม่บังคับ </span>
                  <span>แต่เพื่อให้ช่วยพนักงานจำออเดอร์ของคุณง่ายขึ้น</span>
                </>
              ) : (
                <>
                  <span className="text-red-600">Not required </span>
                  <span>
                    But to help employees remember your orders more easily
                  </span>
                </>
              )}
            </span>
          </label>
        </div>

        <div className="w-full max-w-xs pt-5 form-control">
          <label className="label">
            <span className="text-lg label-text">
              {userLanguage === "th"
                ? "เบอร์โทรศัพท์ของคุณ"
                : "Your phone number "}
            </span>
          </label>

          <input
            id="inputValue-id"
            name="inputValue-1"
            type="text"
            className="w-full max-w-xs input input-bordered"
            maxLength={10}
            value={textCustomerPhoneNumber}
            onChange={handleTextCustomerPhone}
          />

          <label className="text-lg label label-text">
            {userLanguage === "th" ? (
              <>
                <span>เพื่อรับแต้ม </span>
                <span className="text-2xl font-bold text-green-600">
                  {orderValue.orderPriceAll}{" "}
                </span>
                <span></span>
              </>
            ) : (
              <>
                <span>for collect point</span>
                <span className="text-2xl font-bold text-green-600">
                  {orderValue.orderPriceAll}
                </span>
                <span></span>
              </>
            )}
          </label>
        </div>
        <div className="flex items-center justify-center modal-action">
          {resState.isLoading ? (
            <button className="text-white btn btn-info btn-block no-animation">
              <span className="loading loading-spinner"></span>
              {userLanguage === "th"
                ? "กำลังสั่งซื้อสินค้า"
                : "Ordering products"}
            </button>
          ) : (
            <button
              className="text-white btn btn-info btn-block"
              onClick={() => {
                confirmCreateOrder();
              }}
            >
              <box-icon
                name="check-circle"
                type="solid"
                color="#ffffff"
              ></box-icon>

              {userLanguage === "th" ? "ยันยืน" : "Confirm"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
