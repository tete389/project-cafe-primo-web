/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import { BaseURL, findAddOnAll, updateToProductForm } from "../service/BaseURL";
import { useEffect } from "react";
import { useState } from "react";

export default function DialogAddMoreAddOnPanal(params) {
  const {
    resAddOn,
    prodFormId,
    setOpenAddMoreAddOn,
    urlDetail,
    setResUpdateStatusState,
    setOnOpenToast
  } = params;

  const url = `${BaseURL}${findAddOnAll}`;
  const { resAddOnDetail, resLoading, resError } =
    getMenuAddOnAll(url);
  const { mutate } = useSWRConfig();

  const [newAddOn, setNewAddOn] = useState([{}]);
  const [addOnCheck, setAddOnCheck] = useState([]);

  const filterOldData = () => {
    const result = resAddOnDetail.filter(
      (e) => !resAddOn.some((some) => some.addOnId === e.addOnId)
    );
    setNewAddOn(result);
  };

  useEffect(() => {
    if (!resLoading) {
      filterOldData();
    }
  }, [resLoading]);

  const checkSelectAddOn = (addOnId) => {

    setAddOnCheck((prev) => {
      if (prev.find((e) => e === addOnId)) {
        return [...prev.filter((e) => e !== addOnId)];
      } else {
        return [...prev, addOnId];
      }
    });

  };

  const sendUpdateAddOnForm = async (formId) => {
    if (addOnCheck.length <=0) {
      handleOnClose();
      return;
    }
    const newItem = addOnCheck?.map((el) => {
      return { addOnId: el };
    });
    // const result = newItem?.concat(
    //   resAddOn?.map((el) => {
    //     return { addOnId: el.addOnId };
    //   })
    // );

    const fetcherUpdateProd = async () => {
      let dataJson = JSON.stringify({
        prodFormId: formId,
        addOn: newItem,
      });

      const sendUrl = `${BaseURL}${updateToProductForm}`;
      setOnOpenToast(true)
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
        mutate(urlDetail);
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
        handleOnClose();
      }
    };
    ////////// use
    await fetcherUpdateProd();
  };

  let timeToOut;
  const handleOnClose = () => {
    timeToOut = setTimeout(() => {
      setOpenAddMoreAddOn(false);
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, []);

  return (
    <>
      <form method="dialog" className="modal-box w-max">
        <button
          className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
          onClick={() => handleOnClose()}
        >
          ✕
        </button>
        <h3 className="text-lg font-bold">{}</h3>
        <div>
          <ul className="w-56 menu bg-base-200 rounded-box">
            <li>
              <h2 className="menu-title">เพิ่มตัวเลือก</h2>
              <ul>
                {newAddOn?.map((e, index) => (
                  <li key={index} className="pt-2">
                    <a
                      className={` ${
                        addOnCheck.find((ele) => ele === e.addOnId) && `active`
                      }`}
                      onClick={() => checkSelectAddOn(e.addOnId)}
                    >
                      {e.addOnTitleTh}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
        <div className="modal-action">
          {/* if there is a button, it will close the modal */}
          <button
            className="btn"
            onClick={() => sendUpdateAddOnForm(prodFormId)}
          >
            ยืนยัน
          </button>
        </div>
      </form>
    </>
  );
}

const fetcherMenuAddOnAll = (url) => axios.get(url).then((res) => res.data.res);
const getMenuAddOnAll = (url) => {
  const { data, error, isLoading, mutate } = useSWR(url, fetcherMenuAddOnAll, {
    revalidateOnFocus: false,
  });
  return {
    resAddOnDetail: data,
    resLoading: isLoading,
    resError: error,
    resMutate: mutate,
  };
};
