import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

export default function DialogCollectPoint(params) {
    const { phonePoint, setPhonePoint, shopSettingInfo, dialogSelect } = params;
  
    const [collect, setCollect] = useState("");
  
    const handleInputPhoneChange = (event) => {
      if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
        setPhonePoint((prev) => ({
          ...prev,
          phoneNumber: event.target.value,
        }));
      }
    };
  
    const handleInputCollectMoreChange = (event) => {
      if (/^[0-9]+$/.test(event.target.value) || event.target.value === "") {
        setCollect(Number(event.target.value));
        setPhonePoint((prev) => ({
          ...prev,
          collectPoint:
            Number(shopSettingInfo?.pointCollectRate) *
              Number(dialogSelect.orderPrice) +
            Number(event.target.value),
          collectMore: Number(event.target.value),
        }));
      }
    };
  
    useEffect(() => {
      setPhonePoint({
        phoneNumber: "",
        collectPoint: shopSettingInfo?.pointCollectRate * dialogSelect.orderPrice,
        collectMore: 0,
      });
      setCollect("");
    }, [dialogSelect]);
  
    return (
      <>
        {dialogSelect.nextStatus === "Success Order" && (
          <div className="form-control">
            <label className="label">
              <span className="text-lg label-text">
                {dialogSelect.dialogBody}
              </span>
            </label>
            <aside className="mb-2 card bg-neutral ">
              <aside className="py-2 card-body">
                <label className="mt-3">
                  <input
                    type="text"
                    placeholder="เบอร์โทรศัพท์"
                    maxLength={10}
                    className="h-10 input input-bordered"
                    value={phonePoint.phoneNumber}
                    onChange={handleInputPhoneChange}
                  />
                </label>
                <div className="flex justify-between text-neutral-content">
                  <span>รับแต้มพื้นฐาน</span>
                  <span>
                    {/* {phonePoint.collectPoint} */}
                    {shopSettingInfo?.pointCollectRate * dialogSelect.orderPrice}
                  </span>
                </div>
                <label className="flex items-center justify-between">
                  <span className="w-[35%] bg-neutral text-neutral-content">
                    รับแต้มเพิ่มเติม
                  </span>
                  <input
                    type="text"
                    maxLength={7}
                    placeholder="0"
                    className="w-[25%] h-8 input input-bordered"
                    value={collect}
                    onChange={handleInputCollectMoreChange}
                  />
                </label>
                <div className="flex justify-between pb-2 text-neutral-content">
                  <span>รวม</span>
                  <span>{phonePoint.collectPoint}</span>
                </div>
              </aside>
            </aside>
          </div>
        )}
      </>
    );
  }



//   return (
//     <>
//       {dialogSelect.nextStatus === "Success Order" && (
//         <div className="form-control">
//           <label className="label">
//             <span className="text-lg label-text">
//               {dialogSelect.dialogBody}
//             </span>
//           </label>
//           <aside className="mb-2 card bg-neutral ">
//             <aside className="py-2 card-body">
//               <label className="mt-3">
//                 <input
//                   type="text"
//                   placeholder="เบอร์โทรศัพท์"
//                   maxLength={10}
//                   className="h-10 input input-bordered"
//                   value={phonePoint.phoneNumber}
//                   onChange={handleInputPhoneChange}
//                 />
//               </label>
//               <div className="flex justify-between text-neutral-content">
//                 <span>รับแต้มพื้นฐาน</span>
//                 <span>
//                   {/* {phonePoint.collectPoint} */}
//                   {shopSettingInfo?.pointCollectRate * dialogSelect.orderPrice}
//                 </span>
//               </div>
//               <label className="flex items-center justify-between">
//                 <span className="w-[35%] bg-neutral text-neutral-content">
//                   รับแต้มเพิ่มเติม
//                 </span>
//                 <input
//                   type="text"
//                   maxLength={7}
//                   placeholder="0"
//                   className="w-[25%] h-8 input input-bordered"
//                   value={collect}
//                   onChange={handleInputCollectMoreChange}
//                 />
//               </label>
//               <div className="flex justify-between pb-2 text-neutral-content">
//                 <span>รวม</span>
//                 <span>{phonePoint.collectPoint}</span>
//               </div>
//             </aside>
//           </aside>
//         </div>
//       )}
//     </>
//   );