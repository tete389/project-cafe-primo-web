/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import useSWR from "swr";
import {
  BaseURL,
  dateEnd,
  dateStart,
  findRecentOrder,
  findRecentOrderDetailAll,
  haveIncome,
  pageNum,
  pageSize,
  statusOrder,
} from "../../service/BaseURL";
import axios from "axios";
import { Bar, Bubble, Doughnut, Line, Pie, PolarArea } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js/auto";
import randomColor from "randomcolor";
import useScreenSize from "../useScreenSize";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const dateStart = `2023-10-01`;

  const currentTh1 = new Date()
    .toLocaleDateString("en-US", {
      timeZone: "Asia/Bangkok",
    })
  const toDateTh1 = currentTh1.split("/");
  const dateTh1 = `${toDateTh1[2]}-${toDateTh1[0]}-${toDateTh1[1]}`;

  const { recentOrder, recentOrderLoading, recentOrdersError } = getRecentOrder(
    dateTh1,
    dateTh1,
    30,
    0
  );

  const { recentDetailOrder, recentProductLoading, recentProductError } =
    getRecentDetailOrder(dateTh1, dateTh1, 30, 0);

  // const findProductHot = (recentProduct) => {
  //   if (!recentProduct) {
  //     return;
  //   }
  //   let highestValue = -Infinity;
  //   let highestValueObjects = [];

  //   recentProduct.forEach((item) => {
  //     if (item.quantity > highestValue) {
  //       highestValue = item.quantity;
  //       highestValueObjects = [item];
  //     } else if (item.quantity === highestValue) {
  //       highestValueObjects.push(item.prodNameTh);
  //     }
  //   });
  //   return highestValueObjects[0]?.prodNameTh;
  // };

  // const findOptionHot = (recentOption) => {
  //   if (!recentOption) {
  //     return;
  //   }
  //   let highestValue = -Infinity;
  //   let highestValueObjects = [];

  //   recentOption.forEach((item) => {
  //     if (item.quantity > highestValue) {
  //       highestValue = item.quantity;
  //       highestValueObjects = [item];
  //     } else if (item.quantity === highestValue) {
  //       highestValueObjects.push(item.optionlNameTh);
  //     }
  //   });
  //   return highestValueObjects[0]?.optionlNameTh;
  // };

  // const findOrderPriceAll = (order) => {
  //   if (!order) {
  //     return;
  //   }
  //   let result = order
  //     .map((e) => e.orderPrice)
  //     .reduce((sum, number) => sum + number);
  //   return result;
  // };

  const incomeOfDay = (listOrder) => {
    if (!listOrder || listOrder.length === 0) {
      return 0;
    }
    const filterSuccessOrder = listOrder?.filter((f) => f.status === "Success");
    const result = filterSuccessOrder
      .map((e) => e.orderPrice)
      .reduce((sum, number) => {
        return sum + number;
      }, 0);
    return result;
  };

  const resultOrderToDay = recentOrder?.listOrder?.map((ord) => ord.status);
  const resultStatusToday = [...new Set(resultOrderToDay)]?.map((f) => {
    let count = 0;
    resultOrderToDay.filter((m) => {
      if (f === m) {
        count = count + 1;
      }
    });
    return { status: f, quantity: count };
  });

  return (
    <main className="pt-16 ">
      <div className="w-screen bg-base-100">
        <p className="pt-0 pb-1 text-2xl font-extrabold stat text-base-content">
          รายงาน
        </p>
      </div>
      <div className="px-2 overflow-hidden">
        <section className="h-screen mx-auto overflow-auto sm:container md:max-w-3xl lg:max-w-4xl xl:max-w-5xl scrollerBar pb-36">
          <div className="flex flex-col justify-between pt-1 lg:flex-row">
            <div className=" rounded-b-none lg:rounded-lg shadow w-full lg:w-[20%] stats scrollerBar stats-horizontal lg:stats-vertical">
              <div className="p-0 text-center stat">
                <div className="stat-figure"></div>
                <div className="stat-title">รายได้สัปดาห์นี้</div>
                <div className="stat-value">
                  {recentOrder?.incomeOfWeek ? recentOrder?.incomeOfWeek : 0}{" "}
                </div>
                <div className="stat-desc">บาท</div>
              </div>
              <div className="p-0 text-center stat">
                <div className="stat-title ">รายได้เดือนนี้</div>
                <div className="stat-value">
                  {recentOrder?.incomeOfMonth ? recentOrder?.incomeOfMonth : 0}
                </div>
                <div className="stat-desc">บาท</div>
              </div>
            </div>

            <div className=" w-full lg:w-[79.5%] p-1 rounded-b-lg lg:rounded-lg h-max bg-base-100 lg:mb-0">
              {recentDetailOrder && (
                <RecentOrderIncomeChart
                  incomeToChart={(recentOrder?.incomeToChart && recentOrder?.incomeToChart.length > 0) ? recentOrder?.incomeOfMonth : []}
                  year={toDateTh1[2]}
                  month={toDateTh1[0]}
                />
              )}
            </div>
          </div>

          <div className="w-full mt-1 shadow stats scrollerBar stats-horizontal">
            <div className="px-0 text-center stat">
              <div className="stat-title">รายได้วันนี้</div>
              <div className="stat-value">
                {recentOrder?.listOrder
                  ? incomeOfDay(recentOrder?.listOrder)
                  : 0}
              </div>
              <div className="stat-desc">บาท</div>
            </div>
            <div className="px-0 text-center stat">
              <div className="stat-figure"></div>
              <div className="stat-title">ออเดอร์วันนี้</div>
              <div className="stat-value">
                {recentOrder?.listOrder ? recentOrder?.listOrder.length : 0}{" "}
              </div>
              <div className="stat-desc">รายการ</div>
            </div>
          </div>
          <TabStatusOrder
            recentOrder={recentOrder}
            resultStatusToday={resultStatusToday}
          />
          <div className="flex flex-col justify-between w-full pt-1 lg:flex-row">
            <div className="lg:w-[66%] table-sm lg:table-md overflow-x-auto rounded-t-lg lg:rounded-lg bg-base-100  h-72">
              <TableOrder listOrder={recentOrder?.listOrder} />
            </div>

            <div className="w-full lg:w-[33.5%] p-1 rounded-b-lg lg:rounded-lg bg-base-100 h-72  ">
              {recentDetailOrder && (
                <RecentOrderStatusToDayChart
                  resultStatusToday={resultStatusToday}
                />
              )}
            </div>
          </div>

          <div className="w-full mt-1 rounded-lg h-max bg-base-100">
            {recentDetailOrder && (
              <RecentProductToDayChart recentDetailOrder={recentDetailOrder} />
            )}
          </div>

          <div className="flex flex-col justify-between px-0 rounded-lg h-max">
            <div className="flex justify-between pt-1">
              {recentDetailOrder && (
                <div className="w-[49.5%] rounded-lg bg-base-100 p-2">
                  <RecentMaterialChart recentDetailOrder={recentDetailOrder} />
                </div>
              )}

              {recentDetailOrder && (
                <div className="w-[49.5%] rounded-lg bg-base-100 p-2">
                  <RecentOptionChart recentDetailOrder={recentDetailOrder} />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function TabStatusOrder(params) {
  const { recentOrder, resultStatusToday } = params;

  const resultStatuSuccess = () => {
    if (!resultStatusToday || resultStatusToday.length === 0) {
      return 0;
    }
    const filterSuccessOrder = resultStatusToday?.find(
      (f) => f.status === "Success"
    );
    if (filterSuccessOrder) {
      return filterSuccessOrder?.quantity;
    }
    return 0;
  };

  const resultStatuReceive = () => {
    if (!resultStatusToday || resultStatusToday.length === 0) {
      return 0;
    }
    const filterSuccessOrder = resultStatusToday?.find(
      (f) => f.status === "Receive"
    );
    if (filterSuccessOrder) {
      return filterSuccessOrder?.quantity;
    }
    return 0;
  };

  const resultStatusPayment = () => {
    if (!resultStatusToday || resultStatusToday.length === 0) {
      return 0;
    }
    const filterSuccessOrder = resultStatusToday?.find(
      (f) => f.status === "Payment"
    );
    if (filterSuccessOrder) {
      return filterSuccessOrder?.quantity;
    }
    return 0;
  };

  const resultStatusMaking = () => {
    if (!resultStatusToday || resultStatusToday.length === 0) {
      return 0;
    }
    const filterSuccessOrder = resultStatusToday?.find(
      (f) => f.status === "Making"
    );
    if (filterSuccessOrder) {
      return filterSuccessOrder?.quantity;
    }
    return 0;
  };

  const resultStatusCancel = () => {
    if (!resultStatusToday || resultStatusToday.length === 0) {
      return 0;
    }
    const filterSuccessOrder = resultStatusToday?.find(
      (f) => f.status === "Cancel"
    );
    if (filterSuccessOrder) {
      return filterSuccessOrder?.quantity;
    }
    return 0;
  };
  return (
    <>
      <div className="w-full mt-1 shadow stats scrollerBar stats-horizontal">
        <div className="p-0 text-center stat">
          <div className="stat-figure"></div>
          <div className="stat-title">รอชำระเงิน</div>
          <div className="stat-value">
            {recentOrder?.listOrder ? resultStatusPayment() : 0}{" "}
          </div>
          <div className="stat-desc">รายการ</div>
        </div>

        <div className="p-0 text-center stat">
          <div className="stat-figure"></div>
          <div className="stat-title">กำลังทำ</div>
          <div className="stat-value">
            {recentOrder?.listOrder ? resultStatusMaking() : 0}{" "}
          </div>
          <div className="stat-desc">รายการ</div>
        </div>

        <div className="p-0 text-center stat">
          <div className="stat-figure"></div>
          <div className="stat-title">รอรับสินค้า</div>
          <div className="stat-value">
            {recentOrder?.listOrder ? resultStatuReceive() : 0}{" "}
          </div>
          <div className="stat-desc">รายการ</div>
        </div>
        <div className="p-0 text-center stat">
          <div className="stat-figure"></div>
          <div className="stat-title">สำเร็จ</div>
          <div className="stat-value">
            {recentOrder?.listOrder ? resultStatuSuccess() : 0}{" "}
          </div>
          <div className="stat-desc">รายการ</div>
        </div>
        <div className="p-0 text-center stat">
          <div className="stat-figure"></div>
          <div className="stat-title">ยกเลิก</div>
          <div className="stat-value">
            {recentOrder?.listOrder ? resultStatusCancel() : 0}{" "}
          </div>
          <div className="stat-desc">รายการ</div>
        </div>
      </div>
    </>
  );
}

function TableOrder(params) {
  const { listOrder } = params;

  const manageDate = (orderDateTime) => {
    if (orderDateTime) {
      const originalString = orderDateTime?.split(/[ ]/);
      return `${originalString[1]}`;
    }
    return "";
  };
  return (
    <>
      <table className="table table-pin-rows table-pin-cols">
        {/* head */}
        <thead>
          <tr>
            <th>หมายเลข</th>
            <th>เวลา</th>
            <th>ชื่อลูกค้า</th>
            <th>ราคารวม</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {listOrder?.map((e) => (
            <tr key={e.orderId} className="hover">
              <th>{e.orderNumber}</th>
              <td>{manageDate(e.orderDate)}</td>
              <td>{e.customerName}</td>
              <td>{e.orderPrice}</td>
              <th>
                <ByCassStatus status={e.status} />
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function ByCassStatus(params) {
  const { status } = params;

  switch (status) {
    case "Payment":
      return <>รอชำระเงิน</>;
    case "Making":
      return <>กำลังทำ</>;
    case "Receive":
      return <>รอรับสินค้า</>;
    case "Success":
      return <>สำเร็จออเดอร์</>;
    case "Keep":
      return <>ภายหลัง</>;
    case "Cancel":
      return <>ยกเลิก</>;
    default:
      return <></>;
  }
}

function RecentOrderIncomeChart(params) {
  const { incomeToChart, year, month } = params;
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  if (incomeToChart.length > 0) {
    for(const incomeChart of incomeToChart){
      data[(Number(incomeChart[0]) - 1)] =  incomeChart[1]
    }
  }
  // data[month - 1] = incomeOfMonth
  const resultRandomColor = labels?.map(() => {
    return randomColor({ luminosity: "light" });
  });

  const dataRecentOrderStatus = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: resultRandomColor,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
        // position: "right",
      },
      title: {
        display: true,
        text: `รายได้ต่อเดือน ${year}`,
      },
    },
  };

  return (
    <>
      <Bar data={dataRecentOrderStatus} options={options} />
    </>
  );
}

function RecentOrderStatusToDayChart(params) {
  const { resultStatusToday } = params;

  // const manageDate = (orderDateTime) => {
  //   if (orderDateTime) {
  //     const originalString = orderDateTime?.split(/[ ]/);
  //     return `${originalString[0]}`;
  //   }
  //   return "";
  // };

  // const resultOrderToDay = recentOrder
  //   ?.filter((e) => {
  //     if (manageDate(e.orderDate) === dateCurrent) {
  //       return e;
  //     }
  //   })
  //   .map((ord) => ord.status);

  const resultStatusHigh = resultStatusToday?.sort(
    (a, b) => b.quantity - a.quantity
  );

  const ByStatus = (status) => {
    switch (status) {
      case "Payment":
        return "รอชำระเงิน";
      case "Making":
        return "กำลังทำ";
      case "Receive":
        return "รอรับสินค้า";
      case "Success":
        return "สำเร็จออเดอร์";
      case "Keep":
        return "ภายหลัง";
      case "Cancel":
        return "ยกเลิก";
      default:
        return "";
    }
  };

  const resultStatus = resultStatusHigh?.map((p) => ByStatus(p.status));
  const resultStatusQuantity = resultStatusHigh?.map((p) => p.quantity);
  const resultRandomColor = resultStatusHigh?.map(() => {
    return randomColor({ luminosity: "light" });
  });

  const dataRecentOrderStatus = {
    labels: resultStatus,
    datasets: [
      {
        data: resultStatusQuantity,
        backgroundColor: resultRandomColor,
      },
    ],
  };

  const screenSize = useScreenSize();

  let poistionBySize;
  if (screenSize.width > 1024) {
    poistionBySize = "top";
  } else {
    poistionBySize = "right";
  }

  const options = {
    // responsive: true,
    plugins: {
      legend: {
        display: true,
        position: poistionBySize,
      },
      title: {
        display: true,
        text: `สถานะออเดอร์ประจำวัน`,
      },
    },
  };

  return (
    <>
      <Doughnut data={dataRecentOrderStatus} options={options} />
    </>
  );
}

function RecentProductToDayChart(params) {
  const { recentDetailOrder } = params;

  const resultProdNameThHigh = recentDetailOrder?.recentProduct?.sort(
    (a, b) => b.quantity - a.quantity
  );
  const resultProdNameTh = resultProdNameThHigh?.map((p) => p.prodNameTh);
  const resultProdQuantity = resultProdNameThHigh?.map((p) => p.quantity);

  const resultRandomColor = resultProdNameThHigh?.map(() =>
    randomColor({ luminosity: "light" })
  );

  const dataRecentProduct = {
    labels: resultProdNameTh,
    datasets: [
      {
        data: resultProdQuantity,
        backgroundColor: resultRandomColor,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
        position: "botton",
      },
      title: {
        display: true,
        text: `ยอดสั่งสินค้าประจำวัน`,
      },
    },
  };

  return (
    <>
      <Bar data={dataRecentProduct} options={options} />
    </>
  );
}

function RecentOptionChart(params) {
  const { recentDetailOrder } = params;

  const resultOptionNameThHigh = recentDetailOrder?.recentOption?.sort(
    (a, b) => b.quantity - a.quantity
  );
  const resultOptionlNameTh = resultOptionNameThHigh?.map(
    (p) => p.optionlNameTh
  );
  const resultOptionlQuantity = resultOptionNameThHigh?.map((p) => p.quantity);

  const resultRandomColor = resultOptionNameThHigh?.map(() =>
    randomColor({ luminosity: "light" })
  );

  const dataRecentProduct = {
    labels: resultOptionlNameTh,
    datasets: [
      {
        data: resultOptionlQuantity,
        backgroundColor: resultRandomColor,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: ` ยอดสั่งตัวเลือกประจำวัน`,
      },
    },
  };

  return (
    <>
      <Pie data={dataRecentProduct} options={options} />
    </>
  );
}

function RecentMaterialChart(params) {
  const { recentDetailOrder } = params;

  const resultMateNameHigh = recentDetailOrder?.recentMaterail?.sort(
    (a, b) => b.quantity - a.quantity
  );
  const resultMateName = resultMateNameHigh?.map((p) => p.materailName);
  const resultMateQuantity = resultMateNameHigh?.map((p) => p.quantity);

  const resultRandomColor = resultMateNameHigh?.map(() =>
    randomColor({ luminosity: "light" })
  );

  const dataRecentOption = {
    labels: resultMateName,
    datasets: [
      {
        // label: "ยอดขายสินค้าใน 7 วัน",
        data: resultMateQuantity,
        backgroundColor: resultRandomColor,
        // borderColor: "rgb(255 255 255 / var(--tw-bg-opacity))",
        // borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: `ยอดใช้สินค้าคงคลังประจำวัน`,
      },
    },
  };
  return (
    <>
      <PolarArea data={dataRecentOption} options={options} />
    </>
  );
}

const fetcherRecentOrder = (url) => axios.get(url).then((res) => res.data.res);
const getRecentOrder = (dStart, dEnd, pSize, pNum) => {
  // const status = "Wait Payment";
  const status = "All";
  const { data, error, isLoading } = useSWR(
    `${BaseURL}${findRecentOrder}?${dateStart}${dStart}&${dateEnd}${dEnd}&${statusOrder}${status}&${haveIncome}&${pageSize}${pSize}&${pageNum}${pNum}`,
    fetcherRecentOrder
    // {
    //   revalidateIfStale: false,
    //   revalidateOnFocus: false,
    //   revalidateOnReconnect: false,
    // }
  );
  return {
    recentOrder: data,
    recentOrderLoading: isLoading,
    recentOrderError: error,
  };
};

const fetcherRecentDetailOrder = (url) =>
  axios.get(url).then((res) => res.data.res);
const getRecentDetailOrder = (dStart, dEnd, pSize, pNum) => {
  const status = "All";

  const { data, error, isLoading } = useSWR(
    `${BaseURL}${findRecentOrderDetailAll}&${dateStart}${dStart}&${dateEnd}${dEnd}&${statusOrder}${status}&${pageSize}${pSize}&${pageNum}${pNum}`,
    fetcherRecentDetailOrder
    // {
    //   revalidateIfStale: false,
    //   revalidateOnFocus: false,
    //   revalidateOnReconnect: false,
    // }
  );
  return {
    recentDetailOrder: data,
    recentDetailOrderLoading: isLoading,
    recentDetailOrderError: error,
  };
};
