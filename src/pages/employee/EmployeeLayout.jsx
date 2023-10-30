/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import EmpDrawer from "./EmpDrawer";
import EmpHeader from "./EmpHeader";
import {
  BaseURL,
  findSettingShop,
  getNotifications,
} from "../../service/BaseURL";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import axios from "axios";
let stompClient = null;
import useSWR from "swr";
import ToastAlertLoading from "../../components/ToastAlertLoading";
import ToastAlertSuccess from "../../components/ToastAlertSuccess";
import ToastAlertError from "../../components/ToastAlertError";


export const EmployeeContext = createContext();
export const ToastAlertContext = createContext();

export default function EmployeeLayout() {
  // const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState();
  const { setingShopData, isLoadingSetingShop, isErrorSetingShop } =
    getSettingShopData();

  const toGetNotifications = async () => {
    const socket = new SockJS(`${BaseURL}/ws`);
    stompClient = over(socket);

    try {
      await stompClient.connect({}, () => {
        stompClient.subscribe(
          "/topic/employee_notifications",
          (notification) => {
            setNotifications(JSON.parse(notification.body));
          }
        );
        axios.post(`${BaseURL}${getNotifications}`);
      });
    } catch (error) {
      console.error("error : ", error);
    }
  };

  useEffect(() => {
    toGetNotifications();
    return () => {
      stompClient.disconnect();
    };
  }, []);

  function ButtonDrawer() {
    return (
      <>
        <label
          htmlFor="my-drawer-2"
          className="btn btn-ghost drawer-button lg:hidden"
        >
          <box-icon name="list-ul" color="#272727"></box-icon>
        </label>
      </>
    );
  }

  const [onOpenToast, setOnOpenToast] = useState(false);
  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    resUpdate: "",
    errorUpdate: "",
    isLoadingUpdate: false,
  });

  // const [openDrawerRight, setOpenDrawerRight] = useState({
  //   openDrawerPopup: false,
  //   openOrderDetail: false,
  //   openRecordDetail: false,
  //   id: "",
  // });

  // const handleOpenOrderDetail = (newOpen, id) => {
  //   setOpenDrawerRight({
  //     openDrawerPopup: newOpen,
  //     openOrderDetail: newOpen,
  //     openRecordDetail: false,
  //     id: id,
  //   });
  // };

  // const handleOpenRecordDetail = (newOpen, id) => {
  //   setOpenDrawerRight({
  //     openDrawerPopup: newOpen,
  //     openOrderDetail: false,
  //     openRecordDetail: newOpen,
  //     id: id,
  //   });
  // };

  if (isLoadingSetingShop) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isErrorSetingShop) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="loading loading-ring loading-lg"></span>
        <p>การเชื่อมต่อล้มเหลว</p>
      </div>
    );
  }
  return (
    <EmployeeContext.Provider
      value={{
        notifications,
        setingShopData,
        // openDrawerRight,
        // handleOpenOrderDetail,
        // handleOpenRecordDetail,
      }}
    >
      <div className=" drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="flex flex-col h-full overflow-hidden drawer-content bg-neutral-content">
          {/* Page content here */}

          <EmpHeader onDrawerToggle={<ButtonDrawer />} />
          <ToastAlertContext.Provider
            value={{
              setOnOpenToast,
              setResUpdateStatusState,
            }}
          >
            <Outlet />
          </ToastAlertContext.Provider>
        </div>
        <div className="z-[9999] drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="min-h-full w-max menu bg-neutral text-base-content">
            {/* Sidebar content here */}
            <EmpDrawer />
          </ul>
        </div>
      </div>
      {/* Drawer Mui*/}
      {/* <SwipeableDrawer
        anchor="right"
        variant="temporary"
        open={openDrawerRight.openDrawerPopup}
        onClose={() => handleOpenOrderDetail(false)}
        onOpen={() => handleOpenOrderDetail(true)}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          zIndex: "10000",
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            overflow: "hidden",
          },
        }}
      >
         
        {openDrawerRight.openOrderDetail && (
          <OrderDetailPopup
            handleOpenOrderDetail={handleOpenOrderDetail}
            id={openDrawerRight.id}
          />
        )}

        {openDrawerRight.openRecordDetail && (
          <ReportDetailPopup
            handleOpenRecordDetail={handleOpenRecordDetail}
            id={openDrawerRight.id}
          />
        )}
      </SwipeableDrawer> */}

      {/*  Toast   */}
      <>
        {onOpenToast &&
          (resUpdateStatusState.isLoadingUpdate ? (
            <ToastAlertLoading />
          ) : resUpdateStatusState.resUpdate ? (
            <ToastAlertSuccess
              setOnOpenToast={setOnOpenToast}
              successMessage={"คำขอสำเร็จ"}
            />
          ) : (
            <ToastAlertError
              setOnOpenToast={setOnOpenToast}
              errorMessage={"คำขอไม่สำเร็จ"}
            />
          ))}
      </>
    </EmployeeContext.Provider>
  );
}

const fetcherSettingShop = (url) => axios.get(url).then((res) => res.data.res);
const getSettingShopData = () => {
  const { data, error, isLoading } = useSWR(
    `${BaseURL}${findSettingShop}`,
    fetcherSettingShop,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    setingShopData: data,
    isLoading,
    isError: error,
  };
};
