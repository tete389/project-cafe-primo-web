/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  BaseURL,
  findProductFormByBaseId,
  haveAddOn,
  haveOption,
} from "../service/BaseURL";
import useSWR from "swr";
import ResErrorScreen from "./ResErrorScreen";
import { BasketValueContext, LanguageContext } from "../pages/customer/Store";

export default function PopupSelectMenu(props) {
  const { filterSelectProduct, handleSelectMenuPopup } = props;

  const { resData, isLoading, isError } = getProductFormData(
    filterSelectProduct.prodBaseId
  );

  const { setBasketValue } = useContext(BasketValueContext);
  const userLanguage = useContext(LanguageContext);

  const [tabsForm, setTabsForm] = useState();
  const [optionSelect, setOptionSelect] = useState({});
  const [menuForm, setMenuForm] = useState();

  // let filterSelectForm;
  const filterSelectForm = resData?.find((e) => e.prodFormId === tabsForm);
  // const dataFrom = Object.assign({}, resData[0]);

  const handleChangeTabs = (prodFormId) => {
    const cuurrentProdForm = resData.find((e) => e.prodFormId === prodFormId);
    setTabsForm(prodFormId);
    if (cuurrentProdForm) {
      setMenuForm((prev) => {
        return {
          ...prev,
          formId: cuurrentProdForm.prodFormId,
          formNameTh: cuurrentProdForm.prodFormTh,
          formNameEng: cuurrentProdForm.prodFormEng,
          formPrice: cuurrentProdForm.price,
          // count: 1,
          options: [],
          optionsPrice: 0,
        };
      });
      // setOptionSelect({});
    }
  };

  useEffect(() => {
    if (!resData) {
      return;
    }
    const currentTh = new Date();
    const hours = currentTh.getHours().toString();
    const minutes = currentTh.getMinutes().toString();
    const seconds = currentTh.getSeconds().toString();
    const micro = currentTh.getMilliseconds().toString();
    setMenuForm({
      itemId: hours + minutes + seconds + micro,
      baseId: filterSelectProduct?.prodBaseId,
      baseNameTh: filterSelectProduct?.prodTitleTh,
      baseNameEng: filterSelectProduct?.prodTitleEng,
      formId: resData[0]?.prodFormId,
      formNameTh: resData[0]?.prodFormTh,
      formNameEng: resData[0]?.prodFormEng,
      formPrice: resData[0]?.price,
      count: 1,
      options: [],
      optionsPrice: 0,
    });
    setTabsForm(resData[0].prodFormId);
    // filterSelectForm = resData?.find((e, index) => index === tabsForm);
  }, [resData]);

  useEffect(() => {
    const optionSelector = Object?.keys(optionSelect)?.reduce(
      (acc, key) => [...acc, ...optionSelect[key]],
      []
    );
    const priceOpt = optionSelector
      ?.map((e) => e.price)
      .reduce((sum, price) => {
        return sum + price;
      }, 0);
    setMenuForm((prev) => ({
      ...prev,
      options: optionSelector,
      optionsPrice: priceOpt,
    }));
  }, [optionSelect]);

  const handleMenuFormCount = (value) => {
    if (value < 0 && menuForm.count <= 1) {
      return;
    }
    setMenuForm((prev) => ({
      ...prev,
      count: prev.count + value,
    }));
  };

  const handleResetMenuFormCount = () => {
    setMenuForm((prev) => ({
      ...prev,
      count: 1,
    }));
  };

  const handleAddToBasket = (confirm) => {
    if (confirm) {
      setBasketValue((prev) => ({
        menu: [...prev.menu, menuForm],
      }));
    }
    handleSelectMenuPopup(false);
  };

  if (isError) {
    return <ResErrorScreen />;
  }

  return (
    <div className="h-full bg-base-100">
      <div className="flex flex-row items-center justify-between py-1">
        <p className="px-5 text-3xl font-extrabold text-base-content">
          {userLanguage === "th"
            ? filterSelectProduct.prodTitleTh
            : filterSelectProduct.prodTitleEng}
        </p>
        <div className="flex flex-row items-center">
          <div className="dropdown dropdown-end">
            <div
              htmlFor="0"
              tabIndex={0}
              className="btn btn-circle btn-ghost btn-x"
            >
              <box-icon
                name="help-circle"
                color="hsl(var(--bc) / var(--tw-text-opacity))"
              ></box-icon>
            </div>
            <div
              id="0"
              tabIndex={0}
              className="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-base-content text-base-100"
            >
              {userLanguage === "th" ? (
                <div className="card-body ">
                  <h2 className="card-title">รายละเอียด</h2>
                  <p>{filterSelectProduct.description}</p>
                </div>
              ) : (
                <div className="card-body ">
                  <h2 className="card-title">Description</h2>
                  <p className="">{filterSelectProduct.description}</p>
                </div>
              )}
            </div>
          </div>

          <button
            className="btn btn-circle btn-link"
            onClick={() => handleSelectMenuPopup(false)}
          >
            <box-icon
              name="x"
              color="hsl(var(--bc) / var(--tw-text-opacity))"
            ></box-icon>
          </button>
        </div>
      </div>

      {isLoading ? (
        <progress className="w-56 progress"></progress>
      ) : (
        resData && (
          <div className="flex-none h-full ">
            {/* <div className="flex flex-col w-full "> */}
            <ul className="w-full px-2 overflow-auto rounded-2xl menu menu-horizontal menu-lg bg-base-200 flex-nowrap scrollerBar">
              {resData?.map((e) => (
                <li
                  key={e.prodFormId}
                  onClick={() => {
                    if (!e.isEnable || !e.isMaterialEnable) {
                      return;
                    }
                    handleChangeTabs(e.prodFormId);
                  }}
                  className="px-1 "
                >
                  {e.isEnable && e.isMaterialEnable ? (
                    <a
                      className={` text-xl font-semibold text-base-content  ${
                        tabsForm === e.prodFormId ? `active` : `bg-base-100`
                      }`}
                    >
                      <span>
                        {userLanguage === "th" ? e.prodFormTh : e.prodFormEng}{" "}
                        {e.price}
                      </span>
                    </a>
                  ) : (
                    <a
                      className={` text-xl font-semibold text-base-content bg-base-300`}
                    >
                      <div className="indicator">
                        <span className="indicator-item indicator-top indicator-center badge badge-warning">
                          {userLanguage === "th" ? "หมด" : "out of stock"}
                        </span>
                        <span>
                          {userLanguage === "th" ? e.prodFormTh : e.prodFormEng}{" "}
                          {e.price}
                        </span>
                      </div>
                    </a>
                  )}
                </li>
              ))}
            </ul>
            {/* </div> */}

            <div className="flex flex-col w-full h-full overflow-hidden">
              <p className="w-full px-5 py-3 text-2xl font-bold text-base-content">
                {userLanguage === "th" ? "เพิ่มเติม" : "Additional"}
              </p>
              <div className="h-full pb-[265px] overflow-auto bg-base-300 md:grid md:content-start md:grid-cols-2 md:gap-3 lg:grid-cols-3 lg:gap-5">
                {filterSelectForm?.addOnOption.length > 0 &&
                filterSelectForm?.isEnable &&
                filterSelectForm?.isMaterialEnable ? (
                  filterSelectForm?.addOnOption?.map((e) => (
                    <AddOnBox
                      key={e.addOnId}
                      addOn={e}
                      setOptionSelect={setOptionSelect}
                      tabsForm={tabsForm}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-2xl font-semibold">
                      {userLanguage === "th"
                        ? "ไม่มีตัวเลือกเพิ่มเติม"
                        : "No additional options"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-start justify-center w-full pb-3 shadow-2xl md:items-center bg-base-100">
              <div className="p-2 pb-5 join join-horizontal text-base-content">
                <p className="w-full px-5 text-2xl font-bold">
                  {userLanguage === "th" ? "จำนวน" : "amount"}
                </p>
                <button
                  className="text-2xl font-bold w-14 btn join-item"
                  onClick={() => handleMenuFormCount(-1)}
                >
                  -
                </button>
                <button
                  className="w-16 text-2xl font-bold btn join-item btn-ghost"
                  onClick={() => handleResetMenuFormCount()}
                >
                  {menuForm?.count}
                </button>
                <button
                  className="text-2xl font-bold w-14 btn join-item"
                  onClick={() => handleMenuFormCount(1)}
                >
                  +
                </button>
              </div>

              <button
                className="w-full md:w-2/4 btn rounded-3xl btn-info "
                disabled={
                  filterSelectForm?.isEnable &&
                  filterSelectForm?.isMaterialEnable
                    ? false
                    : true
                }
                // disabled={false}
                onClick={() => {
                  if (
                    !filterSelectForm?.isEnable ||
                    !filterSelectForm?.isMaterialEnable
                  ) {
                    return;
                  }
                  handleAddToBasket(true);
                }}
              >
                <p className="text-2xl text-base-100 ">
                  {userLanguage === "th"
                    ? "เพิ่มลงตะกร้า  ฿"
                    : "add to basket  ฿"}

                  {(menuForm?.formPrice + menuForm?.optionsPrice) *
                    menuForm?.count}
                </p>
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function AddOnBox(props) {
  const { addOn, setOptionSelect, tabsForm } = props;

  const userLanguage = useContext(LanguageContext);
  const [tabsOption, setTabsOption] = useState([]);

  const handleChangeTabOneOption = (optionId) => {
    setTabsOption((prev) => {
      if (prev?.find((e) => e === optionId)) {
        return [];
      }
      return [optionId];
    });
  };

  const handleChangeTabsManyOption = (optionId) => {
    setTabsOption((prev) => {
      if (prev?.find((e) => e === optionId)) {
        return [...prev.filter((e) => e !== optionId)];
      } else {
        return [...prev, optionId];
      }
    });
  };

  useEffect(() => {
    if (!tabsOption) {
      return;
    }
    const filterSelectOption = addOn?.options?.filter((fil) => {
      return tabsOption?.find((e) => e === fil.optionId);
    });
    if (filterSelectOption.length !== 0) {
      setOptionSelect((prev) => ({
        ...prev,
        ["options" + addOn.addOnId]: filterSelectOption,
      }));
    } else {
      setOptionSelect((prev) => {
        delete prev["options" + addOn.addOnId];
        return { ...prev };
      });
    }
  }, [tabsOption]);

  useEffect(() => {
    setTabsOption([]);
  }, [tabsForm]);

  return (
    <>
      <div className="m-2 card bg-base-100">
        <div className="card-body">
          <div className="text-base-content card-title">
            {/* <div className="absolute dropdown dropdown-end right-2 top-2">
              <div
                htmlFor="0"
                tabIndex={0}
                className="btn btn-circle btn-ghost btn-x"
              >
                <box-icon
                  name="help-circle"
                  color="hsl(var(--bc) / var(--tw-text-opacity))"
                ></box-icon>
              </div>
              <div
                id="0"
                tabIndex={0}
                className="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-base-content text-base-100"
              >
                {userLanguage === "th" ? (
                  <div className="card-body ">
                    <h2 className="card-title">รายละเอียด</h2>
                    <p>{addOn.description}</p>
                  </div>
                ) : (
                  <div className="card-body ">
                    <h2 className="card-title">Description</h2>
                    <p className="">{addOn.description}</p>
                  </div>
                )}
              </div>
            </div> */}

            <p className="text-2xl font-semibold">
              {userLanguage === "th"
                ? addOn?.addOnTitleTh
                : addOn?.addOnTitleEng}

              {/* <button
                className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
                // onClick={() => deleteOrder(bv.itemId)}
              >
                <box-icon
                  name="help-circle"
                  color="hsl(var(--bc) / var(--tw-text-opacity))"
                ></box-icon>
              </button> */}

              {addOn?.isManyOptions ? (
                <span className="pl-5 text-base opacity-70">
                  {userLanguage === "th"
                    ? "เลือกได้หลายตัวเลือก"
                    : "choose several options"}
                </span>
              ) : (
                <span className="pl-5 text-base opacity-70">
                  {userLanguage === "th"
                    ? " เลือกได้ 1 ตัวเลือก"
                    : "choose one option"}
                </span>
              )}
            </p>
          </div>
          <div className=" card-actions">
            {addOn?.isManyOptions
              ? addOn.options?.map((option, index) => (
                  <div key={index} className="w-full form-control">
                    <label className="cursor-pointer label text-base-content">
                      <span className="flex justify-between ">
                        <input
                          name={option.optionNameEng}
                          type="checkbox"
                          // defaultChecked={false}
                          checked={tabsOption?.some(
                            (e) => e === option.optionId
                          )}
                          className="checkbox checkbox-lg checkbox-primary"
                          onChange={() =>
                            handleChangeTabsManyOption(option.optionId)
                          }
                        />
                        <span className="ml-5 text-lg opacity-80 label-text">
                          {userLanguage === "th"
                            ? option.optionNameTh
                            : option.optionNameEng}
                        </span>
                      </span>
                      <span className="text-lg label-text">
                        + {option.price}
                      </span>
                    </label>
                  </div>
                ))
              : addOn.options?.map((option, index) => (
                  <div key={index} className="w-full form-control">
                    <label className="cursor-pointer label text-base-content">
                      <span className="flex justify-between ">
                        <input
                          name={option.optionNameEng}
                          type="checkbox"
                          // defaultChecked={false}
                          checked={tabsOption?.some(
                            (e) => e === option.optionId
                          )}
                          className="checkbox checkbox-lg checkbox-primary"
                          onChange={() =>
                            handleChangeTabOneOption(option.optionId)
                          }
                        />
                        <span className="ml-5 text-lg label-text opacity-80">
                          {userLanguage === "th"
                            ? option.optionNameTh
                            : option.optionNameEng}
                        </span>
                      </span>
                      <span className="text-lg label-text">
                        + {option.price}
                      </span>
                    </label>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}

const fetcher = (url) => axios.get(url).then((res) => res.data.res);
const getProductFormData = (baseId) => {
  const { data, error, isLoading } = useSWR(
    `${BaseURL}${findProductFormByBaseId}${baseId}&${haveAddOn}&${haveOption}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    resData: data,
    isLoading,
    isError: error,
  };
};
