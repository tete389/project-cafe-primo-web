/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { BaseURL, findOrderById, haveOrderDetail } from "../service/BaseURL";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";

export default function OrderDetail(props) {
  const { orderSelect } = props;

  const { detailOrder, detailOrderError, detailOrderLoading } =
    getOrderDetail(orderSelect);

  // let arrayOfSubstrings = [];
  // if (detailOrder) {
  //   const originalString = detailOrder?.orderDate;
  //   arrayOfSubstrings = originalString?.split(" ");
  // }

  if (detailOrderLoading) {
    return <progress className="w-56 progress"></progress>;
  }

  return (
    <>
      {detailOrder && (
        <article className="pt-2 bg-white card">
          <div className="p-0 m-0 card-body">
            <header className="flex justify-between card-title">
              <aside className="flex flex-col"></aside>
            </header>
            <aside>
              <div>
                <div className="flex flex-col justify-around lg:flex-row">
                  <div className="flex-col w-full xl:w-[47%] ">
                    {detailOrder.orderDetailProducts?.map((e, index) => (
                      <aside
                        className="mb-2 card bg-neutral text-neutral-content"
                        key={index}
                      >
                        <aside className="py-4 card-body">
                          <div className="flex justify-between card-title">
                            <span>{e.prodNameTh}</span>
                            <span>{e.prodPrice}</span>
                          </div>
                          {e.orderDetailOptions?.map((opt, index) => (
                            <div
                              key={index}
                              className="flex justify-between pl-4"
                            >
                              <h5>{opt.optionNameTh}</h5>
                              <h5>{opt.optionPrice}</h5>
                            </div>
                          ))}
                          <div className="flex justify-between text-xl font-bold">
                            <span>จำนวน</span> <span>{e.quantity}</span>
                          </div>
                          <p className="text-xl font-bold text-end">
                            {e.detailPrice}
                          </p>
                        </aside>
                      </aside>
                    ))}
                  </div>

                  <div className="w-full xl:w-[47%] h-max ">
                    {detailOrder.note && detailOrder.note !== "none" && (
                      <aside className="mb-2 border-2 card bg-base-100 text-neutral">
                        <div className="py-4 card-body">
                          <span className="text-lg card-title">
                            ข้อความจากผู้ชื้อ
                          </span>
                          <span> {detailOrder.note}</span>
                        </div>
                      </aside>
                    )}
                    <aside className=" card bg-neutral-content text-neutral">
                      <div className="py-4 card-body ">
                        <div className="flex justify-between ">
                          <p className="">รวมเบื้องต้น</p>
                          <p className="font-bold text-end">
                            {detailOrder.totalDetailPrice}
                          </p>
                        </div>
                        {detailOrder.discount !== 0 && (
                          <div className="flex justify-between ">
                            <p className="">ส่วนลดจากการใช้แต้ม </p>
                            <p className="font-bold text-end">
                              {detailOrder.discount}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-row">
                          <p className="text-2xl font-bold text-center ">รวม</p>
                          <p className="text-2xl font-bold text-end">
                            {detailOrder.orderPrice}
                          </p>
                        </div>
                      </div>
                      {/* <div className="justify-center card-actions">sss</div> */}
                    </aside>
                  </div>
                </div>
              </div>
            </aside>
            <aside className="justify-end card-actions">
              {/* <button className="btn btn-primary">Accept</button>
                <button className="btn btn-ghost">Deny</button> */}
            </aside>
          </div>
        </article>
      )}
    </>
  );
}

const fetcherOrderSelect = (url) => axios.get(url).then((res) => res.data.res);
const getOrderDetail = (orderId) => {
  const { data, error, isLoading } = useSWR(
    `${BaseURL}${findOrderById}${orderId}&${haveOrderDetail}`,
    fetcherOrderSelect,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    detailOrder: data,
    detailOrderLoading: isLoading,
    detailOrderError: error,
  };
};
