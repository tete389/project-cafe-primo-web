/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";

import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import {
  BaseURL,
  addBaseToCategory,
  findCategoryAll,
} from "../service/BaseURL";

export default function DialogAddCategoryPanal(params) {
  const {
    resProductDetail,
    closeAdd,
    urlDetail,
    setResUpdateStatusState,
    setOnOpenToast,
  } = params;

  const url = `${BaseURL}${findCategoryAll}`;
  const { resMenuCategory, resLoading } =
    getMenuCategory(url);

  const { mutate } = useSWRConfig();

  const [newCate, setNewCate] = useState([{}]);
  const [cateCheck, setCateCheck] = useState([]);

  const filterOldData = () => {
    const result = resMenuCategory.filter(
      (e) => !resProductDetail.category.some((some) => some.cateId === e.cateId)
    );
    setNewCate(result);
  };

  useEffect(() => {
    if (!resLoading) {
      filterOldData();
    }
  }, [resLoading]);

  const checkSelectCate = (cateId) => {
    setCateCheck((prev) => {
      if (prev.find((e) => e === cateId)) {
        return [...prev.filter((e) => e !== cateId)];
      } else {
        return [...prev, cateId];
      }
    });
  };


  // update
  const sendUpdateCategoryProduct = async (prodId) => {
    if (cateCheck.length <= 0) {
       handleOnClose();
       return;
    }
    const newItem = cateCheck?.map((el) => {
      return { cateId: el };
    });
    // const result = newItem?.concat(
    //   resProductDetail.category?.map((el) => {
    //     return { cateId: el.cateId };
    //   })
    // );

    const fetcherUpdateProd = async () => {
      let dataJson = JSON.stringify({
        prodBaseId: prodId,
        listCategory: newItem,
      });

      const sendUrl = `${BaseURL}${addBaseToCategory}`;
      setOnOpenToast(true);
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
      closeAdd();
    }, 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeToOut);
  }, [timeToOut]);

  return (
    <form method="dialog" className="modal-box w-max">
      <button
        className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
        onClick={() => handleOnClose()}
      >
        ✕
      </button>
      {/* <h3 className="text-lg font-bold">{}</h3> */}
      <div>
        <ul className="w-56 menu bg-base-200 rounded-box">
          <li>
            <p className="menu-title">เพิ่มหมวดหมู่สินค้า</p>
            <ul>
              {newCate?.map((e, index) => (
                <li key={index} className="mt-2">
                  <a
                    className={` ${
                      cateCheck.find((ele) => ele === e.cateId) && `active`
                    }`}
                    onClick={() => checkSelectCate(e.cateId)}
                  >
                    {e.cateNameTh}
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
          onClick={() => sendUpdateCategoryProduct(resProductDetail.prodBaseId)}
        >
          ยืนยัน
        </button>
      </div>
    </form>
  );
}

const fetcherMenuCategory = (url) => axios.get(url).then((res) => res.data.res);
const getMenuCategory = (url) => {
  const { data, error, isLoading, mutate } = useSWR(url, fetcherMenuCategory, {
    revalidateOnFocus: false,
  });
  return {
    resMenuCategory: data,
    resLoading: isLoading,
    resError: error,
    resMutate: mutate,
  };
};
