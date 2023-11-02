/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useState } from "react";
import { BasketValueContext, LanguageContext } from "../pages/Store";
import axios from "axios";
import useSWR from "swr";
import {
  BaseURL,
  findProductFormByBaseId,
  haveAddOn,
  haveOption,
} from "../service/BaseURL";

export default function PopupEditMenu(props) {
  const { menuEdit, handleEditMenuPopup } = props;

  const userLanguage = useContext(LanguageContext);
  const { basketValue, setBasketValue } = useContext(BasketValueContext);

  const filterEditProduct = basketValue?.menu?.find((e, index) => {
    return e.itemId === menuEdit;
    // return index === menuEdit;
  });

  const { resData, isLoading, isError } = getProductFormData(
    filterEditProduct.baseId
  );

  const [tabsForm, setTabsForm] = useState();
  const [optionSelect, setOptionSelect] = useState({});
  const [menuForm, setMenuForm] = useState();

  const filterSelectForm = resData?.find((e) => e.prodFormId === tabsForm);

  const dataFromEdit = Object.assign({}, filterEditProduct);

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

      setOptionSelect({});
    }
  };

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

  const handleAddToBasket = () => {
    // const newBasket = [...basketValue.menu];
    // newBasket[menuEdit] = menuForm;

    const newBasket = [...basketValue.menu].map((e) => {
      if (e.itemId === menuEdit) {
        return menuForm;
      } else {
        return e;
      }
    });
    setBasketValue({
      menu: newBasket,
    });
    handleEditMenuPopup(false);
  };

  useEffect(() => {
    setMenuForm(dataFromEdit);
  }, []);

  //   useEffect(() => {
  //     if (!formData) {
  //       return;
  //     }

  //     setMenuForm(dataBasic);
  //   }, [tabsForm]);

  useEffect(() => {
    resData?.forEach((e) => {
      if (filterEditProduct.formNameEng === e.prodFormEng) {
        setTabsForm(e.prodFormId);
      }
    });
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

  return (
    <div className="h-full bg-base-100">
      <div className="flex flex-row items-center justify-between py-1">
        <p className="px-5 text-3xl font-extrabold text-base-content">
          {userLanguage === "th"
            ? filterEditProduct.baseNameTh
            : filterEditProduct.baseNameEng}
        </p>
        {/* <p className="text-2xl font-medium">
          {userLanguage === "th" ? "(แก้ไข)" : "(Edit)"}
        </p> */}
        <button
          className="btn btn-circle btn-link"
          onClick={() => handleEditMenuPopup(false)}
        >
          <box-icon
            name="x"
            color="hsl(var(--bc) / var(--tw-text-opacity))"
          ></box-icon>
        </button>
      </div>

      {isLoading ? (
        <progress className="w-56 progress"></progress>
      ) : (
        resData && (
          <div className="flex-none h-full ">
            <div className="flex flex-col w-full px-2">
              <ul className="w-full overflow-auto rounded-2xl menu menu-horizontal menu-lg bg-base-200 flex-nowrap scrollerBar">
                {resData?.map((e) => (
                  <li
                    key={e.prodFormId}
                    onClick={() => handleChangeTabs(e.prodFormId)}
                    className="flex flex-row px-1"
                  >
                    <div
                      className={`justify-between text-xl font-semibold text-base-content  ${
                        tabsForm === e.prodFormId ? `active` : `bg-base-100`
                      }`}
                    >
                      <a>
                        {userLanguage === "th" ? e.prodFormTh : e.prodFormEng}
                      </a>
                      <a>{e.price}</a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col w-full h-full overflow-hidden">
              <p className="w-full px-5 py-3 text-2xl font-bold text-base-content">
                {userLanguage === "th" ? "เพิ่มเติม" : "Additional"}
              </p>
              <div className="h-full pb-[265px] overflow-auto bg-base-300 md:grid md:content-start md:grid-cols-2 md:gap-3 lg:grid-cols-3 lg:gap-5">
                {/* <AddOnBoxTest
                  filterSelectForm={filterSelectForm}
                  setOptionSelect={setOptionSelect}
                  optionsEdit={filterEditProduct.options}
                  tabsForm={tabsForm}
                /> */}
                {filterSelectForm?.addOnOption?.length > 0 ? (
                  filterSelectForm.addOnOption?.map((e, index) => (
                    <AddOnBox
                      key={index}
                      addOn={e}
                      // addOnId={e.addOnId}
                      formId={filterSelectForm.prodFormId}
                      setOptionSelect={setOptionSelect}
                      // options={filterEditProduct.options}
                      tabsForm={tabsForm}
                      dataFromEdit={dataFromEdit}
                    />
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-center h-full">
                      <p className="text-2xl font-semibold">
                        {userLanguage === "th"
                          ? "ไม่มีตัวเลือกเพิ่มเติม"
                          : "No additional options"}
                      </p>
                    </div>
                  </>
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
                onClick={() => {
                  handleAddToBasket();
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
  const { addOn, formId, setOptionSelect, tabsForm, dataFromEdit } = props;

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
    if (formId !== dataFromEdit.formId) {
      setTabsOption([]);
    } else {
      const filterEditOption = addOn?.options
        ?.map((fil) => {
          if (dataFromEdit?.options?.find((e) => e.optionId === fil.optionId)) {
            return fil.optionId;
          }
        })
        .filter(Boolean);
      setTabsOption(() => {
        return filterEditOption;
      });
    }
  }, [tabsForm]);

  return (
    <>
      <div className="m-2 card bg-base-100">
        <div className="card-body">
          <div className="text-base-content card-title">
            <p className="text-2xl font-semibold">
              {userLanguage === "th"
                ? addOn?.addOnTitleTh
                : addOn?.addOnTitleEng}
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
                          checked={tabsOption?.some(
                            (e) => e === option.optionId
                          )}
                          className="checkbox checkbox-lg checkbox-primary"
                          value={option.optionId}
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
                          checked={tabsOption?.some(
                            (e) => e === option.optionId
                          )}
                          className=" checkbox checkbox-lg checkbox-primary"
                          value={option.optionId}
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
