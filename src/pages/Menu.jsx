/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
//import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  BaseURL,
  findProductFormByBaseId,
  haveAddOn,
  haveOption,
} from "../service/BaseURL";
import useSWR from "swr";
import "boxicons";

///////////////////////////////////////////////////////////////////////////////////   menu
export default function Menu(props) {
  const { listMenu, handleOpenMenuPopup } = props;

  // const [menuSelect, setMenuSelect] = useState({
  //   baseName: "",
  //   baseId: "",
  // });

  // const [openMenuPopup, setOpenMenuPopup] = useState(false);
  // const handleOpenMenuPopup = (newOpen, menuName, menuId) => () => {
  //   setOpenMenuPopup(newOpen);
  //   setMenuSelect(() => ({ baseId: menuId, baseName: menuName }));
  // };
  // const handleCloseMenuPopup = (value) => {
  //   setOpenMenuPopup(value);
  // };

  // const iOS =
  //   typeof navigator !== "undefined" &&
  //   /iPad|iPhone|iPod/.test(navigator.userAgent);
  // const handleImage = (event) => {
  //   event.target.src = "/images/cafe_image1.png";
  // };
  return (
    <>
      <Box sx={{ pt: "120px", pb: 4 }}>
        <Container sx={{ py: 2 }} maxWidth="xl">
          <Grid container spacing={4} gr="true">
            {listMenu?.map((menu, index) => (
              <Grid item key={index} xs={6} sm={6} md={3} lg={3}>
                <Card
                  variant="text"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <CardActionArea>
                    <CardMedia
                      sx={{
                        bgcolor: "#EAEFF1",
                        borderRadius: "20px",
                        pt: "90%",
                        objectFit: "cover",
                      }}
                      onClick={handleOpenMenuPopup(
                        true,
                        menu.prodTitleTh,
                        menu.prodBaseId,
                        "add",
                        index,
                        0
                      )}
                      image={
                        menu.image === "none"
                          ? "/images/cafe_image3.jpg"
                          : `${menu.image}`
                      }
                    />
                    <Typography variant="h5" component="h2">
                      {menu.prodTitleTh}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      เรื่มต้น {menu.productMinPrice}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* <SwipeableDrawer
        anchor="bottom"
        variant="temporary"
        open={openMenuPopup}
        onClose={handleOpenMenuPopup(false)}
        onOpen={handleOpenMenuPopup(true)}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            borderRadius: "20px 20px 0 0",
            width: "98%",
            left: "1%",
            //width: { sm: 400, md: 400 },
            height: { xs: "85%", sm: "85%", md: "85%", lg: "70%" },
            overflow: "hidden",
          },
        }}
      >
        {openMenuPopup && (
          <MenuPopup
            menuSelect={menuSelect}
            handleBasketValue={handleBasketValue}
            basketValue={basketValue}
            handleCloseMenuPopup={handleCloseMenuPopup}
          />
        )}
      </SwipeableDrawer> */}
    </>
  );
}

// ///////////////////////////////////////////////////////////////////////////////////   pop up select
// function MenuPopUp(props) {
//   const { menuSelect, handleBasketValue, handleCloseMenuPopup } = props;

//   const { formData, isLoading, isError } = getFormData(menuSelect.baseId);

//   const [selectFormTab, setSelectFormTab] = useState(0);
//   const handleChangeTab = (event, newTab) => {
//     handleChangeMenuForm(newTab);
//     setSelectFormTab(() => newTab);
//   };

//   const [menuForm, setMenuForm] = useState({
//     baseId: "",
//     baseName: "",
//     formPrice: 0,
//     formId: "",
//     formName: "",
//     count: 1,
//     options: [],
//     optionsPrice: 0,
//   });
//   const startValuesMenuForm = () => {
//     setMenuForm((prev) => ({
//       ...prev,
//       baseId: menuSelect.baseId,
//       baseName: menuSelect.baseName,
//       formPrice: formData[selectFormTab]?.price,
//       formId: formData[selectFormTab]?.prodFormId,
//       formName: formData[selectFormTab]?.prodForm,
//     }));
//   };

//   const handleChangeMenuForm = (newTab) => {
//     setMenuForm((prev) => ({
//       ...prev,
//       formPrice: formData[newTab]?.price,
//       formId: formData[newTab]?.prodFormId,
//       formName: formData[newTab]?.prodForm,
//       options: [],
//     }));
//   };

//   const handleChangeMenuFormOptions = (optValue, priceOpt) => {
//     setMenuForm((prev) => ({
//       ...prev,
//       options: optValue,
//       optionsPrice: priceOpt,
//     }));
//   };

//   const handleMenuFormCount = (value) => {
//     if (value < 0 && menuForm.count <= 1) {
//       return;
//     }
//     setMenuForm((prev) => ({
//       ...prev,
//       count: prev.count + value,
//     }));
//   };

//   const handleResetMenuFormCount = () => {
//     setMenuForm((prev) => ({
//       ...prev,
//       count: 1,
//     }));
//   };

//   const handleAddToBasket = (value) => {
//     if (value) {
//       handleBasketValue((prev) => ({
//         menu: [...prev.menu, menuForm],
//       }));
//     }
//     handleCloseMenuPopup(!value);
//   };

//   const [selectMenuOpt, setSelectMenuOpt] = useState([]);
//   // const handleSelectMenuOpt = (value) => {
//   //   setSelectMenuOpt(value);
//   // };

//   useEffect(() => {
//     const listFinds = selectMenuOpt?.filter((e) => e.select === true);
//     const priceOpt = listFinds
//       ?.map((e) => e.price)
//       .reduce((sum, price) => {
//         return sum + price;
//       }, 0);
//     if (listFinds && listFinds.length !== 0) {
//       handleChangeMenuFormOptions(listFinds, priceOpt);
//     }
//   }, [selectMenuOpt]);

//   if (isError) return <div>failed to load</div>;
//   if (isLoading)
//     return (
//       <>
//        <div className="w-full max-w-sm p-4 mx-auto border border-blue-300 rounded-md shadow">
//           <div className="flex space-x-4 animate-pulse">
//             <div className="flex-1 py-1 space-y-6">
//               <div className="h-2 rounded bg-slate-200"></div>
//               <div className="space-y-3">
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="h-2 col-span-2 rounded bg-slate-200"></div>
//                   <div className="h-2 col-span-1 rounded bg-slate-200"></div>
//                 </div>
//                 <div className="h-2 rounded bg-slate-200"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );

//   if (formData) {
//     if (menuForm === undefined || !menuForm.baseId) {
//       startValuesMenuForm();
//     }
//   }

//   return (
//     <>
//       <Toolbar>
//         <div className="flex flex-row items-center justify-between w-full ">
//           <div>{menuSelect.baseName}</div>
//           <button className="btn btn-circle btn-link" onClick={() => {handleCloseMenuPopup(false)}}>
//             <box-icon name="x"></box-icon>
//           </button>
//         </div>
//       </Toolbar>
//       <div className="md:flex-none lg:grow lg:flex ">
//         {formData && (
//           <div className="flex flex-row w-full divide-x-2 divide-x-reverse lg:flex-col lg:w-1/3 ">
//             <Tabs
//               orientation="vertical"
//               variant="scrollable"
//               value={selectFormTab}
//               onChange={handleChangeTab}
//               aria-label="Vertical tabs"
//               allowScrollButtonsMobile
//               TabScrollButtonProps={{
//                 disableRipple: true,
//               }}
//               TabIndicatorProps={{
//                 style: { display: "none" },
//               }}
//               className="w-1/2 divide-x-2 divide-x-reverse lg:w-full"
//             >
//               {formData?.map((form, index) => (
//                 <Tab
//                   wrapped
//                   disableRipple
//                   sx={{
//                     "&.MuiTab-root": {
//                       maxWidth: "none",
//                     },
//                   }}
//                   key={index}
//                   label={
//                     <div className="flex flex-row items-center w-full justify-evenly">
//                       <p className="text-2xl">{form.prodForm}</p>
//                       <p className="text-2xl">฿ {form.price}</p>
//                     </div>
//                   }
//                   {...a11yProps(index)}
//                 />
//               ))}
//             </Tabs>
//             <div className="flex flex-col items-center w-1/2 lg:pt-10 lg:w-full">
//               <div className="flex flex-col items-center w-5/6 pb-5 lg:flex-row justify-evenly ">
//                 <p className="pb-4 lg:pb-0">จำนวน</p>
//                 <div className="grid grid-cols-3 join ">
//                   <button
//                     className="join-item btn btn-outline rounded-l-3xl"
//                     onClick={() => handleMenuFormCount(-1)}
//                   >
//                     -
//                   </button>
//                   <button
//                     className="join-item btn btn-ghost "
//                     onClick={handleResetMenuFormCount}
//                   >
//                     <p className="text-2xl text-sky-400">
//                       {menuForm && menuForm?.count}
//                     </p>
//                   </button>
//                   <button
//                     className="join-item btn btn-outline rounded-r-3xl"
//                     onClick={() => handleMenuFormCount(1)}
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//               <button
//                 className="w-2/3 h-10 btn rounded-3xl bg-sky-400 "
//                 onClick={() => {
//                   handleAddToBasket(true);
//                 }}
//               >
//                 <p className="text-white">
//                   {" "}
//                   เพิ่มลงตะกร้า -฿{" "}
//                   {(menuForm?.optionsPrice + formData[selectFormTab]?.price) *
//                     menuForm?.count}
//                 </p>
//               </button>
//             </div>
//           </div>
//         )}
//         <div className="flex flex-col h-full md:w-full lg:w-2/3 ">
//           <div className="absolute z-10 w-full px-5 pb-5 bg-white">
//             เพิ่มเติม
//           </div>
//           <div className="pt-10 overflow-y-scroll md:h-3/5 h-1/2">
//             {formData &&
//               formData?.map((form, index) => (
//                 <TabPanel
//                   value={selectFormTab}
//                   index={index}
//                   key={index}
//                   className="flex flex-col items-center justify-between"
//                 >
//                   {form.addOnOption?.map((addOn, index) => (
//                     <div
//                       key={index}
//                       className="w-5/6 mb-5 rounded-lg shadow-md border-1"
//                     >
//                       <AddOnBox
//                         addOn={addOn}
//                         handleSelectMenuOpt={setSelectMenuOpt}
//                         selectMenuOpt={selectMenuOpt}
//                         addIndex={index}
//                       />
//                     </div>
//                   ))}
//                 </TabPanel>
//               ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// ///////////////////////////////////////////////////////////////////////////////////   add on box
// function AddOnBox(props) {
//   const { addOn, handleSelectMenuOpt, selectMenuOpt } = props;

//   const [selectRadio, setSelectRadio] = useState("");
//   const selectOpt = addOn.options || [];
//   selectOpt.map((e) => {
//     delete e.isEnable, delete e.isMaterialEnable;
//   });

//   const resetSelectRadio = () => {
//     setSelectRadio("");
//     selectOpt.forEach((e) => (e.select = false));
//     handleSelectMenuOpt([...selectMenuOpt]);
//   };

//   const handleCheckedRadio = (event) => {
//     setSelectRadio(event.target.value);
//     selectOpt.forEach((e) => {
//       if (e.optionId === event.target.value) {
//         e.select = true;
//         e.addOn = addOn.addOnTitle;
//         if (!selectMenuOpt.find((e) => e.optionId === event.target.value)) {
//           handleSelectMenuOpt((prev) => [...prev, e]);
//         } else {
//           handleSelectMenuOpt((prev) => [...prev]);
//         }
//       } else {
//         e.select = false;
//       }
//     });
//   };

//   const handleCheckedBox = (event) => {
//     selectOpt.forEach((e) => {
//       if (e.optionId === event.target.value) {
//         e.select = event.target.checked;
//         e.addOn = addOn.addOnTitle;
//         if (!selectMenuOpt?.find((e) => e.optionId === event.target.value)) {
//           handleSelectMenuOpt((prev) => [...prev, e]);
//         } else {
//           handleSelectMenuOpt((prev) => [...prev]);
//         }
//       }
//     });
//   };

//   return (
//     <>
//       <div className="flex flex-row">
//         <div className="p-3 text-xl">{addOn.addOnTitle}</div>
//         {addOn?.isManyOptions ? (
//           <div className="pt-4 text-gray-400">เลือกได้หลายตัวเลือก</div>
//         ) : (
//           <div className="pt-4 text-gray-400">เลือกได้ 1 ตัวเลือก </div>
//         )}
//         {!addOn?.isManyOptions && (
//           <div className="px-4 pt-4">
//             <button className="btn btn-xs btn-link" onClick={resetSelectRadio}>
//               {/* <RefreshIcon /> */}
//               <box-icon name="revision"></box-icon>
//             </button>
//           </div>
//         )}
//       </div>
//       {addOn?.isManyOptions ? (
//         <FormGroup>
//           {addOn.options?.map((option, index) => (
//             <div key={index} className="mx-5 text-gray-500">
//               <FormControlLabel
//                 className="w-full"
//                 control={
//                   <Checkbox
//                     value={option.optionId}
//                     checked={selectOpt?.select}
//                     onChange={handleCheckedBox}
//                     name={option.optionName}
//                   />
//                 }
//                 label={
//                   <div className="flex items-center justify-between w-full">
//                     <div>{option.optionName}</div>
//                     <div>+ {option.price}</div>
//                   </div>
//                 }
//                 sx={{
//                   "& .MuiTypography-root": {
//                     width: "100%",
//                   },
//                 }}
//               />
//             </div>
//           ))}
//         </FormGroup>
//       ) : (
//         <RadioGroup
//           aria-labelledby="controlled-radio-buttons-group"
//           name="controlled-radio-group"
//           value={selectRadio}
//           onChange={handleCheckedRadio}
//         >
//           {addOn.options?.map((option, index) => (
//             <div key={index} className="flex items-center mx-5 text-gray-500 ">
//               <FormControlLabel
//                 className="w-full"
//                 value={option.optionId}
//                 control={<Radio />}
//                 label={
//                   <div className="flex items-center justify-between w-full">
//                     <div>{option.optionName}</div>
//                     <div>+ {option.price}</div>
//                   </div>
//                 }
//                 sx={{
//                   "& .MuiTypography-root": {
//                     width: "100%",
//                   },
//                 }}
//               />
//             </div>
//           ))}
//         </RadioGroup>
//       )}
//     </>
//   );
// }

// function a11yProps(index) {
//   return {
//     id: `vertical-tab-${index}`,
//     "aria-controls": `vertical-tabpanel-${index}`,
//   };
// }

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`full-width-tabpanel-${index}`}
//       aria-labelledby={`full-width-tab-${index}`}
//       {...other}
//     >
//       {value === index && <>{children}</>}
//     </div>
//   );
// }

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
