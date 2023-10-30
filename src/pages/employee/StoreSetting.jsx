import { useContext, useEffect, useState } from "react";
import { EmployeeContext, ToastAlertContext } from "./EmployeeLayout";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import axios from "axios";
import { BaseURL, updateSettingShop } from "../../service/BaseURL";

export default function StoreSetting() {
  const { setingShopData } = useContext(EmployeeContext);

  const [openSetting, setOpenSetting] = useState({
    name: "",
    isOpen: false,
  });

  const handleOpenSetting = (nameOpen) => {
    setOpenSetting({
      name: nameOpen,
      isOpen: true,
    });
  };

  const handleCloseSetting = () => {
    setOpenSetting({
      name: "",
      isOpen: false,
    });
  };

  return (
    <main className="px-2 pt-16 overflow-hidden">
      <div className="container h-screen mx-auto overflow-hidden pb-[120px] sm:max-w-lg">
        <div className="flex flex-row items-center justify-between h-12 p-2 mt-1 rounded-t-md bg-base-200">
          <div className="text-2xl font-extrabold text-base-content scrollerBar">
            <ul>
              <li className="pr-2">ตั้งค่าร้าน</li>
            </ul>
          </div>
        </div>

        <div className="h-full pb-0 overflow-x-auto scrollerBar rounded-b-md">
          {/* <div className="p-0 m-0 divider"></div> */}
          <div className="py-5 card-body bg-base-100">
            {setingShopData && (
              <ManageShopStatus
                openSetting={openSetting}
                handleOpenSetting={handleOpenSetting}
                handleCloseSetting={handleCloseSetting}
                setingShopData={setingShopData}
              />
            )}
          </div>
          <div className="p-0 m-0 divider bg-base-100"></div>
          <div className="py-5 card-body bg-base-100">
            {setingShopData && (
              <ManageShopTime
                openSetting={openSetting}
                handleOpenSetting={handleOpenSetting}
                handleCloseSetting={handleCloseSetting}
                setingShopData={setingShopData}
              />
            )}
          </div>
          <div className="p-0 m-0 divider bg-base-100"></div>
          <div className="py-5 card-body bg-base-100">
            {setingShopData && (
              <ManageShopRatePoint
                openSetting={openSetting}
                handleOpenSetting={handleOpenSetting}
                handleCloseSetting={handleCloseSetting}
                setingShopData={setingShopData}
              />
            )}
          </div>
          <div className="p-0 m-0 divider bg-base-100"></div>
          <div className="py-5 card-body bg-base-100">
            {setingShopData && (
              <ManageShopRateVate
                openSetting={openSetting}
                handleOpenSetting={handleOpenSetting}
                handleCloseSetting={handleCloseSetting}
                setingShopData={setingShopData}
              />
            )}
          </div>
        </div>
        {/* Toast */}
      </div>
    </main>
  );
}

function ManageShopStatus(params) {
  const { setingShopData, handleCloseSetting } = params;

  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const currentTh = new Date()
      .toLocaleString({
        timeZone: "Asia/Bangkok",
      })
      .split(" ")[1];
    setCurrentTime(currentTh);
  }, []);

  const sendUpdateOpenDate = async (action, newOpen) => {
    let dataJson;
    if (action === "isOpenShop") {
      dataJson = JSON.stringify({
        setShopId: setingShopData?.setShopId,
        isOpenShop: newOpen,
        isCloseShop: false,
      });
    } else if (action === "isCloseShop") {
      dataJson = JSON.stringify({
        setShopId: setingShopData?.setShopId,
        isOpenShop: false,
        isCloseShop: newOpen,
      });
    }
    const fetcherUpdateOpenDate = async () => {
      const isLogin = JSON.parse(localStorage.getItem("loggedIn")) || false;
      let customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isLogin?.accessToken}`,
        },
      };
      const sendUrl = `${BaseURL}${updateSettingShop}`;
      setResUpdateStatusState((prev) => ({
        ...prev,
        isLoadingUpdate: true,
      }));
      setOnOpenToast(true);
      try {
        const response = await axios.post(sendUrl, dataJson, customConfig);
        const data = await response.data.res;
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: data,
          errorUpdate: "",
        }));
        setingShopData.isOpenShop = data.isOpenShop;
        setingShopData.isCloseShop = data.isCloseShop;
        handleCloseSetting();
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
    await fetcherUpdateOpenDate();
  };

  return (
    <>
      <>
        <p className="font-bold">สถานะร้าน</p>
        <div className="flex justify-between">
          <div className="w-20"></div>
          {setingShopData?.isOpenShop ? (
            <span className=" badge badge-lg badge-success text-base-content">
              เปิดร้านตลอด
            </span>
          ) : setingShopData?.isCloseShop ? (
            <span className=" badge badge-lg badge-warning text-base-content">
              ปิดร้านตลอด
            </span>
          ) : currentTime > setingShopData?.openDate &&
            currentTime < setingShopData?.closedDate ? (
            <span className=" badge badge-lg badge-success text-base-content">
              เปิดร้านตามเวลา
            </span>
          ) : (
            <span className=" badge badge-lg badge-warning text-base-content">
              ปิดร้านตามเวลา
            </span>
          )}
          <div className="w-10"></div>
        </div>
        <div className="flex justify-between">
          <span>สั่งเปิดตลอด</span>
          <div className="w-20"></div>
          <input
            id="storeSettingOpen"
            type="checkbox"
            className="toggle toggle-success toggle-sm "
            checked={setingShopData?.isOpenShop}
            onChange={() =>
              sendUpdateOpenDate("isOpenShop", !setingShopData?.isOpenShop)
            }
          />
        </div>
        <div className="flex justify-between">
          <span>สั่งปิดตลอด</span>
          <div className="w-20"></div>
          <input
            id="storeSettingClose"
            type="checkbox"
            className="toggle toggle-success toggle-sm "
            checked={setingShopData?.isCloseShop}
            onChange={() =>
              sendUpdateOpenDate("isCloseShop", !setingShopData?.isCloseShop)
            }
          />
        </div>
      </>
    </>
  );
}

function ManageShopTime(params) {
  const { setingShopData, openSetting, handleOpenSetting, handleCloseSetting } =
    params;

  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const [openDate, setOpenDate] = useState();
  const [closeDate, setCloseDate] = useState();

  const manageTime = (time) => {
    if (time) {
      const originalString = time?.split(/:/);
      return `${originalString[0]}:${originalString[1]}`;
    }
    return "";
  };

  const sendUpdateOpenDate = async () => {
    if (!openDate) {
      return;
    }
    const date = openDate.toDate().toTimeString().split(" ");
    const fetcherUpdateOpenDate = async () => {
      let dataJson = JSON.stringify({
        setShopId: setingShopData?.setShopId,
        openDate: date[0],
      });
      const isLogin = JSON.parse(localStorage.getItem("loggedIn")) || false;
      let customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isLogin?.accessToken}`,
        },
      };
      const sendUrl = `${BaseURL}${updateSettingShop}`;
      setResUpdateStatusState((prev) => ({
        ...prev,
        isLoadingUpdate: true,
      }));
      setOnOpenToast(true);
      try {
        const response = await axios.post(sendUrl, dataJson, customConfig);
        const data = await response.data.res;
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: data,
          errorUpdate: "",
        }));
        setingShopData.openDate = data.openDate;
        handleCloseSetting();
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
    await fetcherUpdateOpenDate();
  };

  const sendUpdateCloseDate = async () => {
    if (!closeDate) {
      return;
    }
    const date = closeDate.toDate().toTimeString().split(" ");
    const fetcherUpdateCloseDate = async () => {
      let dataJson = JSON.stringify({
        setShopId: setingShopData?.setShopId,
        closedDate: date[0],
      });
      const isLogin = JSON.parse(localStorage.getItem("loggedIn")) || false;
      let customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isLogin?.accessToken}`,
        },
      };
      const sendUrl = `${BaseURL}${updateSettingShop}`;
      setResUpdateStatusState((prev) => ({
        ...prev,
        isLoadingUpdate: true,
      }));
      setOnOpenToast(true);
      try {
        const response = await axios.post(sendUrl, dataJson, customConfig);
        const data = await response.data.res;
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: data,
          errorUpdate: "",
        }));
        setingShopData.closedDate = data.closedDate;
        handleCloseSetting();
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
    await fetcherUpdateCloseDate();
  };

  return (
    <>
      <>
        <p className="font-bold text-start">เวลาเปิดร้าน</p>
        <div className="flex items-center justify-between">
          {openSetting.name === "openDate" && openSetting.isOpen ? (
            <>
              <div className="w-20"></div>
              <div className="flex items-center justify-center gap-1">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["MobileTimePicker"]}>
                    <DemoItem>
                      <MobileTimePicker
                        defaultValue={dayjs(
                          `2022-04-17T${manageTime(setingShopData?.openDate)}`
                        )}
                        // value={closeDate}
                        onChange={(newDate) => setOpenDate(newDate)}
                        ampm={false}
                        className="w-[70px] p-0 m-0"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
                <span>น.</span>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  className="btn btn-xs btn-success text-base-100"
                  onClick={() => sendUpdateOpenDate()}
                >
                  บันทึก
                </button>
                <button
                  className="btn btn-xs btn-error text-base-100"
                  onClick={() => {
                    handleCloseSetting();
                    setOpenDate();
                  }}
                >
                  ยกเลิก
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-20"></div>
              <span className="font-normal text-center">
                {manageTime(setingShopData?.openDate)} น.
              </span>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => handleOpenSetting("openDate")}
              >
                <box-icon type="solid" name="time"></box-icon>
              </button>
            </>
          )}
        </div>
      </>
      <>
        <p className="font-bold">เวลาปิดร้าน</p>
        <div className="flex items-center justify-between">
          {openSetting.name === "closedDate" && openSetting.isOpen ? (
            <>
              <div className="w-20"></div>
              <div className="flex items-center justify-center gap-1">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["MobileTimePicker"]}>
                    <DemoItem>
                      <MobileTimePicker
                        defaultValue={dayjs(
                          `2022-04-17T${manageTime(setingShopData?.closedDate)}`
                        )}
                        // value={closeDate}
                        onChange={(newDate) => setCloseDate(newDate)}
                        ampm={false}
                        className="w-[70px] p-0 m-0"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
                <span>น.</span>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  className="btn btn-xs btn-success text-base-100"
                  onClick={() => sendUpdateCloseDate()}
                >
                  บันทึก
                </button>
                <button
                  className="btn btn-xs btn-error text-base-100"
                  onClick={() => {
                    handleCloseSetting();
                    setCloseDate();
                  }}
                >
                  ยกเลิก
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-20"></div>
              <span className="font-normal text-center">
                {manageTime(setingShopData?.closedDate)} น.
              </span>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => handleOpenSetting("closedDate")}
              >
                <box-icon name="time-five"></box-icon>
              </button>
            </>
          )}
        </div>
      </>
    </>
  );
}

function ManageShopRatePoint(params) {
  const { setingShopData, openSetting, handleOpenSetting, handleCloseSetting } =
    params;
  const defaultRate = {
    pointCollectRate: setingShopData?.pointCollectRate,
    pointSpendRate: setingShopData?.pointSpendRate,
  };
  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);
  const [newRatePoint, setNewRatePoint] = useState(defaultRate);

  const handleNewCollectRate = (event) => {
    if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
      setNewRatePoint((prev) => ({
        ...prev,
        pointCollectRate: Number(event.target.value),
      }));
    }
  };

  const handleNewSpendRate = (event) => {
    if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
      setNewRatePoint((prev) => ({
        ...prev,
        pointSpendRate: Number(event.target.value),
      }));
    }
  };

  const sendUpdatePointRate = async () => {
    if (!newRatePoint.pointCollectRate || !newRatePoint.pointSpendRate) {
      return;
    }
    if (
      newRatePoint.pointCollectRate === setingShopData?.pointCollectRate &&
      newRatePoint.pointSpendRate === setingShopData?.pointSpendRate
    ) {
      return;
    }

    const fetcherUpdateOpenDate = async () => {
      let dataJson = JSON.stringify({
        setShopId: setingShopData?.setShopId,
        pointCollectRate: newRatePoint?.pointCollectRate,
        pointSpendRate: newRatePoint?.pointSpendRate,
      });
      const isLogin = JSON.parse(localStorage.getItem("loggedIn")) || false;
      let customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isLogin?.accessToken}`,
        },
      };
      const sendUrl = `${BaseURL}${updateSettingShop}`;
      setResUpdateStatusState((prev) => ({
        ...prev,
        isLoadingUpdate: true,
      }));
      setOnOpenToast(true);
      try {
        const response = await axios.post(sendUrl, dataJson, customConfig);
        const data = await response.data.res;
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: data,
          errorUpdate: "",
        }));
        setingShopData.pointCollectRate = data.pointCollectRate;
        setingShopData.pointSpendRate = data.pointSpendRate;
        handleCloseSetting();
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
    await fetcherUpdateOpenDate();
  };

  return (
    <>
      <>
        <p className="font-bold">อัตราการได้รับแต้ม</p>
        <div className="flex items-center justify-between">
          {openSetting?.name === "pointCollectRate" && openSetting.isOpen ? (
            <>
              <div className="w-20"></div>
              <div className="form-control">
                <label className="label" htmlFor="text-pointCollectRate">
                  <span className="label-text">เปลี่ยนอัตราการได้รับแต้ม</span>
                </label>
                <div className="flex flex-row items-center gap-2">
                  <input
                    id="text-pointCollectRate"
                    type="text"
                    maxLength={5}
                    value={newRatePoint.pointCollectRate}
                    className="w-24 text-center input input-bordered"
                    onChange={handleNewCollectRate}
                  />
                  <p>บาท / 1 แต้ม</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  className="btn btn-xs btn-success text-base-100"
                  onClick={() => sendUpdatePointRate()}
                >
                  บันทึก
                </button>
                <button
                  className="btn btn-xs btn-error text-base-100"
                  onClick={() => {
                    handleCloseSetting();
                    setNewRatePoint(defaultRate);
                  }}
                >
                  ยกเลิก
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-20"></div>
              <span className="font-normal text-center">
                {setingShopData?.pointCollectRate} บาท / 1 แต้ม
              </span>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => handleOpenSetting("pointCollectRate")}
              >
                <box-icon type="solid" name="edit"></box-icon>
              </button>
            </>
          )}
        </div>
      </>
      <>
        <p className="font-bold">อัตราการใช้แต้มส่วนลด</p>
        <div className="flex items-center justify-between">
          {openSetting.name === "pointSpendRate" && openSetting.isOpen ? (
            <>
              <div className="w-20"></div>
              <div className="form-control">
                <label className="label" htmlFor="text-pointCollectRate">
                  <span className="label-text">
                    เปลี่ยนอัตราการใช้แต้มเป็นส่วนลด
                  </span>
                </label>
                <div className="flex flex-row items-center gap-2">
                  <input
                    id="text-pointCollectRate"
                    type="text"
                    maxLength={5}
                    value={newRatePoint.pointSpendRate}
                    className="w-24 text-center input input-bordered"
                    onChange={handleNewSpendRate}
                  />
                  <p>แต้ม / 1 ล่วนลด</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  className="btn btn-xs btn-success text-base-100"
                  onClick={() => sendUpdatePointRate()}
                >
                  บันทึก
                </button>
                <button
                  className="btn btn-xs btn-error text-base-100"
                  onClick={() => {
                    handleCloseSetting();
                    setNewRatePoint(defaultRate);
                  }}
                >
                  ยกเลิก
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-20"></div>
              <span className="font-normal text-center">
                {setingShopData?.pointSpendRate} แต้ม / 1 ล่วนลด
              </span>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => handleOpenSetting("pointSpendRate")}
              >
                <box-icon type="solid" name="edit"></box-icon>
              </button>
            </>
          )}
        </div>
      </>
    </>
  );
}

function ManageShopRateVate(params) {
  const { setingShopData, openSetting, handleOpenSetting, handleCloseSetting } =
    params;
  const defaultRate = setingShopData?.vatRate;

  const { setOnOpenToast, setResUpdateStatusState } =
    useContext(ToastAlertContext);

  const [newRateVat, setNewRateVat] = useState(defaultRate);

  const handleNewRateVate = (event) => {
    if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
      setNewRateVat(Number(event.target.value));
    }
  };

  const sendUpdatePointRate = async () => {
    if (!newRateVat) {
      return;
    }
    if (newRateVat === setingShopData?.vatRate) {
      return;
    }

    const fetcherUpdateOpenDate = async () => {
      let dataJson = JSON.stringify({
        setShopId: setingShopData?.setShopId,
        vatRate: newRateVat,
      });
      const isLogin = JSON.parse(localStorage.getItem("loggedIn")) || false;
      let customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isLogin?.accessToken}`,
        },
      };
      const sendUrl = `${BaseURL}${updateSettingShop}`;
      setResUpdateStatusState((prev) => ({
        ...prev,
        isLoadingUpdate: true,
      }));
      setOnOpenToast(true);
      try {
        const response = await axios.post(sendUrl, dataJson, customConfig);
        const data = await response.data.res;
        setResUpdateStatusState((prev) => ({
          ...prev,
          resUpdate: data,
          errorUpdate: "",
        }));
        setingShopData.vatRate = data.vatRate;
        handleCloseSetting();
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
    await fetcherUpdateOpenDate();
  };

  return (
    <>
      <>
        <p className="font-bold">ภาษีมูลค่าเพิ่ม</p>
        <div className="flex items-center justify-between">
          {openSetting?.name === "vatRate" && openSetting.isOpen ? (
            <>
              <div className="w-20"></div>
              <div className="form-control">
                <label className="label" htmlFor="text-pointCollectRate">
                  <span className="label-text">เปลี่ยนอัตราการได้รับแต้ม</span>
                </label>
                <div className="flex flex-row items-center gap-2">
                  <input
                    id="text-pointCollectRate"
                    type="text"
                    maxLength={5}
                    value={newRateVat}
                    className="w-24 text-center input input-bordered"
                    onChange={handleNewRateVate}
                  />
                  <p>%</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  className="btn btn-xs btn-success text-base-100"
                  onClick={() => sendUpdatePointRate()}
                >
                  บันทึก
                </button>
                <button
                  className="btn btn-xs btn-error text-base-100"
                  onClick={() => {
                    handleCloseSetting();
                    setNewRateVat(defaultRate);
                  }}
                >
                  ยกเลิก
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-20"></div>
              <span className="font-normal text-center">
                {setingShopData?.vatRate} %
              </span>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => handleOpenSetting("vatRate")}
              >
                <box-icon name="calendar-edit"></box-icon>
              </button>
            </>
          )}
        </div>
      </>
    </>
  );
}
