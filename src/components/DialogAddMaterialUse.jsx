/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { BaseURL, findMaterialAll } from "../service/BaseURL";
import ResLoadingScreen from "./ResLoadingScreen";
import ResErrorScreen from "./ResErrorScreen";

export default function DialogAddMaterialUse(params) {
  const { idIsUsed, materialUse, closeAdd, sendUpdateMateUsed } = params;

  const url = `${BaseURL}${findMaterialAll}`;
  const { resMenuMaterial, resLoading, resError } = getMenuMaterial(url);

  const [filterMateUse, setFilterMateUse] = useState([{}]);
  const [mateCheck, setMateCheck] = useState([]);

  const filterOldData = () => {
    const result = resMenuMaterial.filter(
      (e) => !materialUse.some((some) => some.mateId === e.mateId)
    );
    setFilterMateUse(result);
  };

  useEffect(() => {
    if (resMenuMaterial) {
      filterOldData();
    }
  }, [resMenuMaterial]);

  const checkSelectMate = (mateId) => {
    setMateCheck((prev) => {
      if (prev.find((e) => e.mateId === mateId)) {
        return [...prev.filter((e) => e.mateId !== mateId)];
      } else {
        return [
          ...prev,
          {
            mateId: mateId,
            useCount: "",
          },
        ];
      }
    });
  };

  const handleMateUsed = (event) => {
    if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
      setMateCheck((prev) => {
        return [
          ...prev.map((e) => {
            if (e.mateId === event.target.id) {
              return { ...e, useCount: event.target.value };
            } else {
              return e;
            }
          }),
        ];
      });
    }
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

  if (resLoading) {
    return (
      <>
        <div className="modal-box w-max">
          <form method="dialog" className="p-2 bg-base-200">
            <button
              className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
              onClick={() => handleOnClose()}
            >
              ✕
            </button>
          </form>
          <div className="card-body">
            <ResLoadingScreen />
          </div>
        </div>
      </>
    );
  }

  if (resError) {
    return (
      <>
        <div className="modal-box w-max">
          <form method="dialog" className="p-2 bg-base-200">
            <button
              className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
              onClick={() => handleOnClose()}
            >
              ✕
            </button>
          </form>
          <div className="card-body">
            <ResErrorScreen />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="modal-box w-max">
      <form method="dialog">
        <button
          className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
          onClick={() => handleOnClose()}
        >
          ✕
        </button>
      </form>

      <div>
        <ul className="w-56 menu bg-base-200 rounded-box">
          <li>
            <p className="menu-title">เพิ่มส่วนผสม</p>
            <ul>
              {filterMateUse?.map((e, index) => (
                <li key={index} className="mt-2">
                  {mateCheck.find((ele) => ele.mateId === e.mateId) ? (
                    <a className=" active">
                      <button onClick={() => checkSelectMate(e.mateId)}>
                        {e.mateName}
                      </button>
                      <div className="form-control">
                        <label className="font-bold input-group input-group-xs w-max text-neutral">
                          <input
                            id={`${e.mateId}`}
                            type="text"
                            value={
                              mateCheck.find((elem) => elem.mateId === e.mateId)
                                .useCount
                            }
                            placeholder=""
                            className="w-20 input input-bordered input-sm"
                            maxLength={5}
                            onChange={handleMateUsed}
                          />
                          <span className=" btn-accent btn-sm">
                            {e.mateUnit}
                          </span>
                        </label>
                      </div>
                    </a>
                  ) : (
                    <a onClick={() => checkSelectMate(e.mateId)}>
                      {e.mateName}
                    </a>
                  )}
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
          onClick={() => sendUpdateMateUsed(idIsUsed, mateCheck)}
        >
          ยืนยัน
        </button>
      </div>
    </div>
  );
}

const fetcherMenuMaterial = (url) => axios.get(url).then((res) => res.data.res);
const getMenuMaterial = (url) => {
  const { data, error, isLoading, mutate } = useSWR(url, fetcherMenuMaterial, {
    revalidateOnFocus: false,
  });
  return {
    resMenuMaterial: data,
    resLoading: isLoading,
    resError: error,
    resMutate: mutate,
  };
};
