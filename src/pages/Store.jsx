/* eslint-disable react-hooks/rules-of-hooks */
import { Fab, SwipeableDrawer } from "@mui/material";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import "../style/store.css";

import BasketPopup from "../components/BasketPopup";

import axios from "axios";
import {
  BaseURL,
  findCategoryAll,
  findSettingShop,
  haveBase,
  haveMinPriceIc,
  pageNum,
  pageSize,
} from "../service/BaseURL";
import "boxicons";
import PopupSelectMenu from "../components/PopupSelectMenu";
import DialogConfirmCreateOrder from "../components/DialogConfirmCreateOrder";
import FollowOrderPopup from "../components/FollowOrderPopup";
import PopupEditMenu from "../components/PopupEditMenu";
import ToastAlertLoading from "../components/ToastAlertLoading";
import ToastAlertError from "../components/ToastAlertError";
import ResLoadingScreen from "../components/ResLoadingScreen";
import ResErrorScreen from "../components/ResErrorScreen";

// export const BasketCareteValueContext = createContext();
export const BasketValueContext = createContext();
export const OrderValueContext = createContext();
export const LanguageContext = createContext();
export const ToastContext = createContext();

export default function Store() {
  const { setingShopData, isLoadingSetingShop, isErrorSetingShop } =
    getSettingShopData();
  const { categoryData, isLoading, isError } = getCategoryData();
  // const screenSize = useScreenSize();
  const [menu, setMenu] = useState({
    menuSelect: "",
    menuEdit: "",
  });
  const [userLanguage, setUserLanguage] = useState("th");
  const [openDrawerRight, setOpenDrawerRight] = useState({
    openDrawerPopup: false,
    openBasketPopup: false,
    openFollowOrder: false,
  });
  const [openDrawerBottom, setOpenDrawerBottom] = useState({
    openDrawerPopup: false,
    openEditMenu: false,
    openSelectMenu: false,
  });
  const [onOpenToast, setOnOpenToast] = useState(false);
  const [resUpdateStatusState, setResUpdateStatusState] = useState({
    res: "",
    error: "",
    isLoading: false,
  });
  const [openDialogConfirmOrder, setOpenDialogConfirmOrder] = useState(false);

  const [basketValue, setBasketValue] = useState({ menu: [] });
  const [orderValue, setOrderValue] = useState({});
  const [followOrder, setfollowOrder] = useState([]);
  const [tabsValue, setTabsValue] = useState(0);

  const filterSelectCategory = categoryData?.find((e, index) => {
    return index === tabsValue;
  });

  const filterSelectProduct = filterSelectCategory?.productBasePrice?.find(
    (e) => {
      return e.prodBaseId === menu.menuSelect;
    }
  );

  const handleOpenBasket = (newOpen) => {
    setOpenDrawerRight({
      openDrawerPopup: newOpen,
      openBasketPopup: newOpen,
      openFollowOrder: false,
    });
  };

  const handleOpenFollowOrder = (newOpen) => {
    setOpenDrawerRight({
      openDrawerPopup: newOpen,
      openBasketPopup: false,
      openFollowOrder: newOpen,
    });
  };

  const handleSelectMenuPopup = (newOpen) => {
    setOpenDrawerBottom({
      openDrawerPopup: newOpen,
      openEditMenu: false,
      openSelectMenu: newOpen,
    });
  };

  const handleEditMenuPopup = (newOpen) => {
    setOpenDrawerBottom({
      openDrawerPopup: newOpen,
      openEditMenu: newOpen,
      openSelectMenu: false,
    });
  };

  // const handleOpenMenuPopup =
  //   (newOpen, menuName, menuId, actionName, indexValue, indexTab) => () => {
  //     setOpenMenuPopup(newOpen);
  //     setMenuSelect(() => ({
  //       baseId: menuId,
  //       baseName: menuName,
  //       action: actionName,
  //       index: indexValue,
  //       selectFormTab: indexTab,
  //     }));
  //   };

  const handleMenuEdit = (itemId) => {
    setMenu((prev) => ({
      ...prev,
      menuEdit: itemId,
    }));
  };

  const handleMenuSelect = (prodBaseId) => {
    setMenu((prev) => ({
      ...prev,
      menuSelect: prodBaseId,
    }));
  };
  const sendCreateOrder = () => {
    setOpenDialogConfirmOrder(true);
    // window.my_modal_confirmCreateOrder.showModal();
    document.getElementById("my_modal_confirmCreateOrder").showModal();
  };

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    ///
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setUserLanguage(storedLanguage);
    }
    const currentTh = new Date().toLocaleTimeString("th-TH", {
      timeZone: "Asia/Bangkok",
    });

    // const hours = currentTh.getHours().toString();
    // const minutes = currentTh.getMinutes().toString();
    // const seconds = currentTh.getSeconds().toString();
    // const time = `${hours}:${minutes}:${seconds}`;
    setCurrentTime(currentTh);
    ///
    const followOrderStorage = localStorage.getItem("followOrder");
    if (followOrderStorage > 0 || followOrderStorage) {
      const follow = JSON.parse(followOrderStorage);
      // const currentDateTh = new Date(
      //   new Date().toLocaleString("en-US", {
      //     timeZone: "Asia/Bangkok",
      //   })
      // );
      // const year = currentDateTh.getFullYear();
      // const month = (currentDateTh.getMonth() + 1).toString().padStart(2, "0");
      // const day = currentDateTh.getDate().toString().padStart(2, "0");
      // const date = `${year}-${month}-${day}`;
      const currentTh1 = new Date().toLocaleDateString("en-US", {
        timeZone: "Asia/Bangkok",
      });

      const toDateTh1 = currentTh1.split("/");
      const dateTh1 = `${toDateTh1[2]}-${toDateTh1[0]}-${toDateTh1[1]}`;
      // setDateOrder(date);
      if (dateTh1 !== follow[0]?.orderDateTime) {
        localStorage.setItem("followOrder", JSON.stringify([]));
        return;
      }
      setfollowOrder(follow);
    }
  }, []);

  if (isError || isErrorSetingShop) {
    return <ResErrorScreen />;
  }

  if (isLoading || isLoadingSetingShop) {
    return <ResLoadingScreen />;
  }

  //  check open shop
  if (setingShopData?.isCloseShop) {
    return (
      <>
        <div
          className="min-h-screen hero"
          style={{
            backgroundImage: "url(images/bg-outTime.png)",
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="text-center hero-content text-neutral-content">
            <div className="max-w-md">
              <p className="mb-5 text-4xl font-bold">ร้านปิด</p>
              {/* <p className="mb-5 text-xl">
                เวลาเปิดร้าน {setingShopData?.openDate} น. -{" "}
                {setingShopData?.closedDate} น.
              </p> */}
            </div>
          </div>
        </div>
      </>
    );
  }

  //  check open shop by time
  if (
    !(
      currentTime > setingShopData?.openDate &&
      currentTime < setingShopData?.closedDate
    ) &&
    !setingShopData?.isOpenShop
  ) {
    return (
      <>
        <div
          className="min-h-screen hero"
          style={{
            backgroundImage: "url(images/bg-outTime.png)",
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="text-center hero-content text-neutral-content">
            <div className="max-w-md">
              <p className="mb-5 text-4xl font-bold">อยู่นอกเวลาเปิดร้าน</p>
              <p className="mb-5 text-xl">
                เวลาเปิดร้าน {setingShopData?.openDate} น. -{" "}
                {setingShopData?.closedDate} น.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  console.log(currentTime);
  return (
    <LanguageContext.Provider value={userLanguage}>
      <ToastContext.Provider
        value={{ setResUpdateStatusState, setOnOpenToast }}
      >
        <AppBarStore setUserLanguage={setUserLanguage} />
        {/* {!openNotifyOrder ? ( */}
        <>
          <BasketValueContext.Provider
            value={{ basketValue, setBasketValue, setingShopData }}
          >
            <OrderValueContext.Provider value={{ orderValue, setOrderValue }}>
              <BodyStroe
                categoryData={categoryData}
                handleMenuSelect={handleMenuSelect}
                handleSelectMenuPopup={handleSelectMenuPopup}
                tabsValue={tabsValue}
                setTabsValue={setTabsValue}
                filterSelectCategory={filterSelectCategory}
              />
              <SwipeableDrawer
                anchor="right"
                variant="temporary"
                open={openDrawerRight.openDrawerPopup}
                onClose={() => handleOpenBasket(false)}
                onOpen={() => handleOpenBasket(true)}
                disableSwipeToOpen={false}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    overflow: "hidden",
                  },
                }}
              >
                {openDrawerRight.openBasketPopup && (
                  <BasketPopup
                    handleOpenBasket={handleOpenBasket}
                    sendCreateOrder={sendCreateOrder}
                    handleEditMenuPopup={handleEditMenuPopup}
                    handleMenuEdit={handleMenuEdit}
                  />
                )}

                {openDrawerRight.openFollowOrder && (
                  <FollowOrderPopup
                    handleOpenFollowOrder={handleOpenFollowOrder}
                    followOrder={followOrder}
                    setfollowOrder={setfollowOrder}
                  />
                )}
              </SwipeableDrawer>

              <SwipeableDrawer
                anchor="bottom"
                variant="temporary"
                open={openDrawerBottom.openDrawerPopup}
                onClose={() => handleSelectMenuPopup(false)}
                onOpen={() => handleSelectMenuPopup(true)}
                disableSwipeToOpen={false}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    borderRadius: "20px 20px 0 0",
                    height: "93%",
                    overflow: "hidden",
                    zIndex: "100",
                  },
                }}
              >
                {openDrawerBottom.openSelectMenu && (
                  <PopupSelectMenu
                    filterSelectProduct={filterSelectProduct}
                    handleSelectMenuPopup={handleSelectMenuPopup}
                  />
                )}

                {openDrawerBottom.openEditMenu && (
                  <PopupEditMenu
                    menuEdit={menu.menuEdit}
                    handleEditMenuPopup={handleEditMenuPopup}
                  />
                )}
              </SwipeableDrawer>

              <Fab
                sx={{
                  width: 50,
                  height: 34,
                  position: "fixed",
                  bottom: 70,
                  right: 20,
                  borderRadius: "12px",
                  bgcolor: "hsl(var(--bc) / var(--tw-bg-opacity))",
                  "&.MuiFab-root": {
                    boxShadow: "none",
                  },
                  ":hover": {
                    bgcolor: "hsl(var(--bc) / var(--tw-bg-opacity))",
                  },
                }}
                className="bg-slate-900"
                disableRipple
                disableFocusRipple
                disableTouchRipple
                aria-label="backet"
                component="div"
                onClick={() => handleOpenFollowOrder(true)}
              >
                <div className="indicator">
                  {followOrder && followOrder.length > 0 && (
                    <span className="w-6 text-white indicator-item badge bg-sky-400 border-sky-400">
                      {followOrder.length}
                    </span>
                  )}
                  <box-icon
                    size="sm"
                    name="file-find"
                    type="solid"
                    color="hsl(var(--b1) / var(--tw-bg-opacity))"
                  ></box-icon>
                </div>
              </Fab>

              <Fab
                sx={{
                  width: 50,
                  height: 34,
                  position: "fixed",
                  bottom: 20,
                  right: 20,
                  borderRadius: "12px",
                  bgcolor: "hsl(var(--bc) / var(--tw-bg-opacity))",
                  "&.MuiFab-root": {
                    boxShadow: "none",
                  },
                  ":hover": {
                    bgcolor: "hsl(var(--bc) / var(--tw-bg-opacity))",
                  },
                }}
                className="bg-slate-900"
                disableRipple
                disableFocusRipple
                disableTouchRipple
                aria-label="backet"
                component="div"
                onClick={() => handleOpenBasket(true)}
              >
                <div className="indicator">
                  {basketValue && basketValue.menu.length > 0 && (
                    <span className="w-6 text-white indicator-item badge bg-sky-400 border-sky-400">
                      {basketValue.menu.length}
                    </span>
                  )}
                  <box-icon
                    size="sm"
                    name="basket"
                    type="solid"
                    color="hsl(var(--b1) / var(--tw-bg-opacity))"
                  ></box-icon>
                </div>
              </Fab>

              {/* //////////////////// */}

              <dialog id="my_modal_confirmCreateOrder" className="modal">
                {openDialogConfirmOrder && (
                  <DialogConfirmCreateOrder
                    setOpenDialogConfirmOrder={setOpenDialogConfirmOrder}
                    handleOpenBasket={handleOpenBasket}
                    setfollowOrder={setfollowOrder}
                  />
                )}

                {/*  Toast   */}
                <>
                  {onOpenToast &&
                    (resUpdateStatusState.isLoading ? (
                      <ToastAlertLoading setOnOpenToast={setOnOpenToast} />
                    ) : (
                      // : resUpdateStatusState.error ? (
                      //   < ToastAlertSuccess
                      //     setOnOpenToast={setOnOpenToast}
                      //       successMessage={"Order Completed"}
                      //   />
                      // )
                      resUpdateStatusState.error && (
                        <ToastAlertError
                          setOnOpenToast={setOnOpenToast}
                          errorMessage={"Order Unsuccessful"}
                        />
                      )
                    ))}
                </>
              </dialog>
            </OrderValueContext.Provider>
          </BasketValueContext.Provider>
        </>
      </ToastContext.Provider>
    </LanguageContext.Provider>
  );
}

function BodyStroe(params) {
  const {
    categoryData,
    handleMenuSelect,
    handleSelectMenuPopup,
    tabsValue,
    setTabsValue,
    filterSelectCategory,
  } = params;

  const userLanguage = useContext(LanguageContext);

  const handleChangeTabs = (index) => {
    setTabsValue(index);
  };

  return (
    <>
      <div className="z-40 h-screen bg-base-300">
        <ul className="fixed pt-[56px] z-40 w-screen  overflow-auto lg:justify-center flex-nowrap menu menu-horizontal bg-base-100 scrollerBar">
          {categoryData &&
            categoryData?.map((cate, index) => (
              <li
                key={cate.cateId}
                className="p-1 text-xl font-bold "
                onClick={() => handleChangeTabs(index)}
              >
                <a
                  className={`  ${
                    tabsValue === index ? `active` : `bg-base-200`
                  } px-5 min-w-[6rem] justify-center`}
                >
                  {userLanguage === "th" ? cate.cateNameTh : cate.cateNameEng}
                </a>
              </li>
            ))}
        </ul>
        <div className="container h-screen mx-auto overflow-hidden ">
          <div className="scrollerBar grid content-start h-full grid-cols-2 gap-3 overflow-auto sm:gap-5 md:gap-8 md:grid-cols-3 lg:grid-cols-4 xl:mx-24 standard:mx-1 pt-32 md:pt-36 pb-[11rem]">
            {categoryData ? (
              filterSelectCategory?.productBasePrice?.map((prod) => (
                <div
                  key={prod.prodBaseId}
                  className={`w-full h-48 overflow-hidden md:h-56 card bg-base-content  ${
                    !prod.productMinPrice && `hidden`
                  }`}
                  onClick={() => {
                    if (!prod.isEnable || !prod.isMaterialEnable) {
                      return;
                    }
                    handleMenuSelect(prod.prodBaseId);
                    handleSelectMenuPopup(true);
                  }}
                >
                  <figure>
                    <div className="indicator">
                      {prod.isEnable && prod.isMaterialEnable ? (
                        <>
                          <img
                            className="object-cover w-max h-max"
                            src={` ${
                              prod.image === "none"
                                ? "/images/cafe_image3.jpg"
                                : `${prod.image}`
                            }`}
                            alt="cafe"
                          />
                        </>
                      ) : (
                        <>
                          <span className="text-lg h-max indicator-item badge badge-warning indicator-middle indicator-center">
                            {userLanguage === "th"
                              ? "สินค้าหมด"
                              : "Out of stock"}
                          </span>
                          <img
                            className="object-cover w-max h-max"
                            src={` ${
                              prod.image === "none"
                                ? "/images/cafe_image3.jpg"
                                : `${prod.image}`
                            }`}
                            alt="Shoes"
                          />
                        </>
                      )}
                    </div>
                  </figure>

                  <div
                    className={`  absolute bottom-0 w-full px-3 py-1  card-body  ${
                      prod.isEnable & prod.isMaterialEnable
                        ? `bg-gray-500/70 text-white `
                        : `bg-gray-500/70  h-full justify-between text-gray-200 `
                    }  `}
                  >
                    {prod.isEnable && prod.isMaterialEnable ? (
                      <></>
                    ) : (
                      <div></div>
                    )}

                    <div className="h-max ">
                      <p className="card-title ">
                        {userLanguage === "th"
                          ? prod.prodTitleTh
                          : prod.prodTitleEng}
                      </p>
                      <p className="font-semibold opacity-70">
                        {userLanguage === "th" ? "เริ่มต้น" : "start"}{" "}
                        {prod.productMinPrice}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>โหลดข้อมูลไม่สำเร็จ</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function AppBarStore(params) {
  const { setUserLanguage } = params;

  const userLanguage = useContext(LanguageContext);

  const handleLanguageChange = (value) => {
    setUserLanguage(value);
    localStorage.setItem("language", value);
  };

  return (
    <>
      <div className="fixed z-50 w-screen">
        <div className="p-0 navbar bg-base-100 min-h-max">
          <div className="flex-1">
            <a className="text-xl normal-case btn btn-ghost">Kaffe Primo</a>
          </div>

          <details className="dropdown dropdown-end">
            <summary className="m-1 btn btn-ghost">
              <box-icon
                name="font-color"
                color="hsl(var(--bc) / var(--tw-text-opacity))"
              ></box-icon>
              <box-icon
                size="sm"
                name="chevron-down"
                color="hsl(var(--bc) / var(--tw-text-opacity))"
              ></box-icon>
            </summary>

            <ul className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li onClick={() => handleLanguageChange("th")}>
                <a className={`${userLanguage === "th" && `active`}`}>ไทย</a>
              </li>
              <li onClick={() => handleLanguageChange("eng")}>
                <a className={`${userLanguage === "eng" && `active`}`}>
                  English
                </a>
              </li>
            </ul>
          </details>
        </div>
      </div>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const fetcher = (url) => axios.get(url).then((res) => res.data.res);
const getCategoryData = () => {
  const { data, error, isLoading } = useSWR(
    `${BaseURL}${findCategoryAll}?${haveBase}&${haveMinPriceIc}&${pageSize}10&${pageNum}0`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    categoryData: data,
    isLoading,
    isError: error,
  };
};
//&${haveMinPriceIc}

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
