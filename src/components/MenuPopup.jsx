/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { Tab, Tabs, Toolbar } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  BaseURL,
  findProductFormByBaseId,
  haveAddOn,
  haveOption,
} from "../service/BaseURL";
import useSWR from "swr";

export default function MenuPopup(props) {
  const { menuSelect, handleBasketValue, basketValue, handleCloseMenuPopup } =
    props;

  const { formData, isLoading, isError } = getFormData(menuSelect.baseId);

  const [selectFormTab, setSelectFormTab] = useState(0);
  const handleChangeTab = (event, newTab) => {
    setSelectFormTab(() => newTab);
    handleChangeMenuForm(newTab);
  };

  const [menuForm, setMenuForm] = useState({
    baseId: "",
    baseName: "",
    formPrice: 0,
    formId: "",
    formName: "",
    count: 1,
    options: [],
    optionsPrice: 0,
    selectFormTab: 0,
  });

  const startValuesMenuForm = () => {
    if (menuSelect.action === "edit") {
      setMenuForm(() => basketValue.menu[menuSelect.index]);
      setSelectFormTab(() => menuSelect.selectFormTab);
    } else {
      setMenuForm((prev) => ({
        ...prev,
        baseId: menuSelect.baseId,
        baseName: menuSelect.baseName,
        formPrice: formData[selectFormTab]?.price,
        formId: formData[selectFormTab]?.prodFormId,
        formName: formData[selectFormTab]?.prodForm,
      }));
    }
  };

  const handleChangeMenuForm = (newTab) => {
    setMenuForm((prev) => ({
      ...prev,
      formPrice: formData[newTab]?.price,
      formId: formData[newTab]?.prodFormId,
      formName: formData[newTab]?.prodForm,
      options: [],
      selectFormTab: newTab,
    }));
    setSelectMenuOpt(() => []);
  };

  const handleChangeMenuFormOptions = (optValue, priceOpt) => {
    setMenuForm((prev) => ({
      ...prev,
      options: optValue,
      optionsPrice: priceOpt,
    }));
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

  const handleAddToBasket = (value) => {
    if (value) {
      if (menuSelect.action === "edit") {
        const edit = basketValue.menu.map((e, index) => {
          if (menuSelect.index === index) {
            return (e = menuForm);
          }
          return e;
        });
        handleBasketValue(() => ({
          menu: edit,
        }));
      } else {
        handleBasketValue((prev) => ({
          menu: [...prev.menu, menuForm],
        }));
      }
    }
    handleCloseMenuPopup(!value);
  };

  const [selectMenuOpt, setSelectMenuOpt] = useState([]);
  const handleSelectMenuOpt = (value) => {
    setSelectMenuOpt(value);
  };

  useEffect(() => {
    const listFinds = selectMenuOpt?.filter((e) => e.select === true);
    const priceOpt = listFinds
      ?.map((e) => e.price)
      .reduce((sum, price) => {
        return sum + price;
      }, 0);
    if (listFinds) {
      handleChangeMenuFormOptions(listFinds, priceOpt);
    }
  }, [selectMenuOpt]);

  if (isError) return <div>failed to load</div>;
  if (isLoading)
    return (
      <>
        <div className="w-full max-w-sm p-4 mx-auto border border-blue-300 rounded-md shadow">
          <div className="flex space-x-4 animate-pulse">
            <div className="flex-1 py-1 space-y-6">
              <div className="h-2 rounded bg-slate-200"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 col-span-2 rounded bg-slate-200"></div>
                  <div className="h-2 col-span-1 rounded bg-slate-200"></div>
                </div>
                <div className="h-2 rounded bg-slate-200"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );

  if (formData) {
    if (menuForm === undefined || !menuForm.baseId) {
      startValuesMenuForm();
    }
  }

  return (
    <div className="h-full">
      <div className="flex flex-row items-center justify-between shadow-md">
        <div className="px-5">{menuSelect.baseName}</div>
        <button
          className="btn btn-circle btn-link"
          onClick={() => {
            handleCloseMenuPopup(false);
          }}
        >
          <box-icon name="x"></box-icon>
        </button>
      </div>

      <div className="flex-none h-full lg:grow lg:flex">
        {formData && (
          <div className="flex flex-row w-full divide-x-2 divide-x-reverse lg:flex-col lg:w-1/3 ">
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={selectFormTab}
              onChange={handleChangeTab}
              aria-label="Vertical-tabs"
              allowScrollButtonsMobile
              TabScrollButtonProps={{
                disableRipple: true,
              }}
              TabIndicatorProps={{
                style: { display: "none" },
              }}
              className="w-1/2 divide-x-2 divide-x-reverse lg:w-full"
            >
              {formData?.map((form, index) => (
                <Tab
                  value={index}
                  wrapped
                  disableRipple
                  sx={{
                    "&.MuiTab-root": {
                      maxWidth: "none",
                    },
                  }}
                  key={index}
                  label={
                    <div className="flex flex-row items-center w-full justify-evenly">
                      <p className="text-2xl">{form.prodFormTh}</p>
                      <p className="text-2xl">฿ {form.price}</p>
                    </div>
                  }
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
            <div className="flex flex-col items-center w-1/2 lg:pt-10 lg:w-full">
              <div className="flex flex-col items-center w-5/6 pb-5 lg:flex-row justify-evenly ">
                <p className="p-2 lg:pb-0">จำนวน</p>
                <div className="grid grid-cols-3 join ">
                  <button
                    className="join-item btn btn-outline rounded-l-3xl"
                    onClick={() => handleMenuFormCount(-1)}
                  >
                    -
                  </button>
                  <button
                    className="join-item btn btn-ghost "
                    onClick={handleResetMenuFormCount}
                  >
                    <p className="text-2xl text-sky-400">
                      {menuForm && menuForm?.count}
                    </p>
                  </button>
                  <button
                    className="join-item btn btn-outline rounded-r-3xl"
                    onClick={() => handleMenuFormCount(1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="w-2/3 h-10 btn rounded-3xl bg-sky-400 "
                onClick={() => {
                  handleAddToBasket(true);
                }}
              >
                <p className="text-white">
                  {" "}
                  เพิ่มลงตะกร้า -฿{" "}
                  {(menuForm?.optionsPrice + formData[selectFormTab]?.price) *
                    menuForm?.count}
                </p>
              </button>
            </div>
          </div>
        )}
        <div
          className="flex flex-col w-full overflow-y-scroll lg:w-2/3"
          style={{ height: "calc(100% - 225px)" }}
        >
          <div className="absolute w-full px-5 bg-white shadow-md lg:shadow-none z-1000 ">
            เพิ่มเติม
          </div>
          <div className="pb-10">
          </div>
          {formData &&
            formData?.map((form, index) => (
              <TabPanel
                value={selectFormTab}
                index={index}
                key={index}
                className="flex flex-col items-center justify-between "
              >
                {form.addOnOption?.map((addOn, index) => (
                  <div
                    key={index}
                    className="w-5/6 mb-5 rounded-lg shadow-md border-1"
                  >
                    <AddOnBox
                      addOn={addOn}
                      handleSelectMenuOpt={handleSelectMenuOpt}
                      selectMenuOpt={selectMenuOpt}
                      menuFormOptions={menuForm.options}
                    />
                  </div>
                ))}
              </TabPanel>
            ))}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}

///////////////////////////////////////////////////////////////////////////////////   add on box
function AddOnBox(props) {
  const { addOn, handleSelectMenuOpt, selectMenuOpt, menuFormOptions } = props;

  const [selectRadio, setSelectRadio] = useState({
    checkOnly: addOn.options?.map((e) => ({
      id: e.optionId,
      checked: false,
    })),
  });

  const selectOpt = addOn.options || [];

  const handleOnlyCheckedBox = (event) => {
    selectOpt.forEach((e) => {
      if (e.optionId === event.target.value) {
        e.select = event.target.checked;
        e.addOn = addOn.addOnTitle;

        if (!selectMenuOpt.find((sm) => sm.optionId === event.target.value)) {
          handleSelectMenuOpt((prev) => [...prev, e]);
        } else {
          handleSelectMenuOpt((prev) => [...prev]);
        }
      } else {
        e.select = false;
      }
    });
    setSelectRadio((prev) => ({
      checkOnly: prev.checkOnly.map((e) =>
        e.id === event.target.value
          ? { ...e, checked: event.target.checked }
          : { ...e, checked: false }
      ),
    }));
  };

  const handleManyCheckedBox = (event) => {
    selectOpt.forEach((e) => {
      if (e.optionId === event.target.value) {
        e.select = event.target.checked;
        e.addOn = addOn.addOnTitle;
        if (!selectMenuOpt?.find((sm) => sm.optionId === event.target.value)) {
          handleSelectMenuOpt((prev) => [...prev, e]);
        } else {
          handleSelectMenuOpt((prev) => [...prev]);
        }
      }
    });
  };

  const setEditAddon = () => {
    handleSelectMenuOpt(menuFormOptions);
    selectOpt.forEach((e) =>
      menuFormOptions.forEach((mf) => {
        if (mf.optionId === e.optionId) {
          setSelectRadio((prev) => ({
            checkOnly: prev.checkOnly.map((e) =>
              e.id === mf.optionId
                ? { ...e, checked: true }
                : { ...e, checked: false }
            ),
          }));
        }
      })
    );
  };

  useEffect(() => {
    if (menuFormOptions === undefined || menuFormOptions.length !== 0) {
      setEditAddon();
    }
  }, []);

  return (
    <div className="px-10 pb-2 ">
      <div className="flex flex-row">
        <p className="py-3 text-xl">{addOn.addOnTitle}</p>
        {addOn?.isManyOptions ? (
          <p className="pt-4 pl-4 text-gray-400">เลือกได้หลายตัวเลือก</p>
        ) : (
          <p className="pt-4 pl-4 text-gray-400">เลือกได้ 1 ตัวเลือก </p>
        )}
      </div>
      {addOn?.isManyOptions
        ? addOn.options?.map((option, index) => (
            <div key={index} className="form-control">
              <label className="cursor-pointer label ">
                <span className="flex justify-between flex-center ">
                  <input
                    type="checkbox"
                    defaultChecked={menuFormOptions?.some((e) => {
                      return e.optionId === option.optionId;
                    })}
                    className="border-indigo-600 checkbox checkbox-lg"
                    value={option.optionId}
                    onChange={handleManyCheckedBox}
                  />
                  <span className="ml-5 text-lg text-gray-500 label-text">
                    {option.optionName}
                  </span>
                </span>
                <span className="text-lg text-gray-500 label-text">
                  {" "}
                  + {option.price}
                </span>
              </label>
            </div>
          ))
        : addOn.options?.map((option, index) => (
            <div key={index} className="form-control">
              <label className="cursor-pointer label ">
                <span className="flex justify-between flex-center ">
                  <input
                    type="checkbox"
                    checked={selectRadio.checkOnly[index].checked}
                    className=" checkbox checkbox-lg border-sky-400"
                    value={option.optionId}
                    onChange={handleOnlyCheckedBox}
                  />
                  <span className="ml-5 text-lg text-gray-500 label-text">
                    {option.optionName}
                  </span>
                </span>
                <span className="text-lg text-gray-500 label-text">
                  {" "}
                  + {option.price}
                </span>
              </label>
            </div>
          ))}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
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

const fetcher = (url) => axios.get(url).then((res) => res.data.res);
const getFormData = (baseId) => {
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
    formData: data,
    isLoading,
    isError: error,
  };
};
