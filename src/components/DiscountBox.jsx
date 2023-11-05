/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { BaseURL, findPoint } from "../service/BaseURL";
import axios from "axios";
import { LanguageContext } from "../pages/customer/Store";


export default function DiscountBox(props) {
  const { setingShopData, handleCreateDiscount, setOpenBox } = props;
  const [dataState, setDataState] = useState({
    point: 0,
    isLoading: false,
    isFetcher: false,
    isError: false,
  });
  const userLanguage = useContext(LanguageContext);

  const [inputPhoneNumber, setInputPhoneNumber] = useState("");

  const handleInputChange = (event) => {
    if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
      setInputPhoneNumber(event.target.value);
    }

    if (dataState.isFetcher) {
      setDataState((prev) => ({
        ...prev,
        isFetcher: false,
      }));
    }
    if (usePoint !== 0) {
      setUsePoint(0);
      handleCreateDiscount({
        phoneNumber: "",
        spendPoint: 0,
      });
    }
  };

  const [usePoint, setUsePoint] = useState(0);
  const resetUsePoint = () => {
    setUsePoint(0);
  };

  const fixUsePoint = (e, currentPoint) => {
    if (Number(currentPoint) >= dataState.point && e >= 0) {
      setUsePoint(Number(dataState.point));
    } else {
      setUsePoint((prev) => {
        if (prev + Number(e) <= 0) {
          return 0;
        }
        return prev + Number(e);
      });
    }
  };

  const getDiscountPoint = () => {
    handleCreateDiscount({
      phoneNumber: inputPhoneNumber,
      spendPoint: usePoint,
    });
    //setDiscount(usePoint / setingShopData?.pointSpendRate);
    setOpenBox((prev) => ({
      ...prev,
      box2: !prev.box2,
    }));
  };

  const getPoint = () => {
    setDataState((prev) => ({
      ...prev,
      isLoading: true,
      isFetcher: false,
    }));

    const fetcher = async () => {
      try {
        const response = await axios.post(
          `${BaseURL}${findPoint}${inputPhoneNumber}`
        );
        const data = await response.data.res;
        setDataState((prev) => ({
          ...prev,
          point: data,
          isFetcher: true,
          isError: false,
        }));
      } catch (error) {
        console.error("error : ", error);
        setDataState((prev) => ({
          ...prev,
          isError: true,
        }));
      } finally {
        setDataState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    fetcher();
  };

  return (
    <>
      <div className=" form-control">
        <label
          className="pt-0 pl-20 label"
          id="inputValue-1"
          htmlFor="inputValue-id"
        >
          <span className="label-text">
            {userLanguage === "th" ? "ตรวจสอบแต้ม" : "Search Point"}
          </span>
        </label>
        <div className="flex justify-center input-group">
          <input
            id="inputValue-id"
            name="inputValue-1"
            type="text"
            // placeholder="เบอร์โทรศัพท์…"
            placeholder={` ${
              userLanguage === "th" ? "เบอร์โทรศัพท์…" : "Phone Number"
            } `}
            maxLength={10}
            className=" input input-bordered"
            value={inputPhoneNumber}
            onChange={handleInputChange}
          />
          <button
            className="btn btn-square"
            disabled={dataState.isLoading}
            onClick={() => getPoint()}
          >
            {dataState.isLoading ? (
              <span className="loading loading-spinner loading-sm "></span>
            ) : (
              <box-icon
                name="search-alt-2"
                color="hsl(var(--bc) / var(--tw-bg-opacity))"
              ></box-icon>
            )}
          </button>
        </div>
      </div>
      <>
        {dataState.isError && (
          <div className="flex justify-center my-3">
            <p className="text-red-500 ">
              ไม่พบข้อมูล กรุณาตรวจสอบหมายเลขอีกครั้ง
            </p>
          </div>
        )}
        {dataState.isFetcher && (
          <>
            <div className="flex flex-row my-3 justify-evenly">
              <p>คุณมีแต้มสะสม : </p>
              <p> {dataState.point}</p> <p>แต้ม</p>
            </div>
            <div className="grid grid-cols-3 join">
              <button
                className=" join-item btn btn-ghost btn-active btn-sm rounded-l-3xl"
                onClick={() => fixUsePoint(-100, usePoint)}
              >
                -
              </button>
              <button
                className="join-item btn btn-ghost btn-sm"
                onClick={resetUsePoint}
              >
                <p className="text-2xl text-sky-400">{usePoint}</p>
              </button>
              <button
                className=" join-item btn btn-ghost btn-active btn-sm rounded-r-3xl"
                onClick={() => fixUsePoint(100, usePoint)}
              >
                +
              </button>
            </div>

            <div className="flex justify-center pt-4">
              <button
                className="text-white btn btn-wide btn-info"
                onClick={getDiscountPoint}
              >
                {" "}
                <box-icon
                  type="solid"
                  name="discount"
                  color="#ffffff"
                ></box-icon>
                รับส่วนลด {usePoint / setingShopData?.pointSpendRate}
              </button>
            </div>
          </>
        )}
      </>
    </>
  );
}
