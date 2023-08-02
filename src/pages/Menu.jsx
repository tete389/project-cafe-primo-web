/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Skeleton,
  SwipeableDrawer,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  BaseURL,
  findProductFormByBaseId,
  haveAddOn,
  haveOption,
} from "../service/BaseURL";
import useSWR from "swr";

///////////////////////////////////////////////////////////////////////////////////   menu
export default function Menu(props) {
  const { listMenu } = props;
  //const navigate = useNavigate();
  //const menu = useLoaderData();
  const [menuSelect, setMenuSelect] = useState({
    baseName: "",
    baseId: "",
  });

  const [openMenu, setOpenMenu] = useState(false);
  const handleOpenMenu = (newOpen, menuName, menuId) => () => {
    setOpenMenu(newOpen);
    setMenuSelect({ baseId: menuId, baseName: menuName });
    //navigate(``);
  };

  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
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
                      onClick={handleOpenMenu(
                        true,
                        menu.prodTitle,
                        menu.prodBaseId
                      )}
                      image="https://img.freepik.com/premium-photo/hot-coffee-morning-wooden-table_838382-54.jpg"
                    />
                    <Typography variant="h5" component="h2">
                      {menu.prodTitle}
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
      <SwipeableDrawer
        anchor="bottom"
        variant="temporary"
        open={openMenu}
        onClose={handleOpenMenu(false)}
        onOpen={handleOpenMenu(true)}
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
            height: "70%",
            overflow: "hidden",
          },
        }}
      >
        {openMenu && <MenuPopUp menuSelect={menuSelect} />}
      </SwipeableDrawer>
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////   pop up select
function MenuPopUp(props) {
  const { menuSelect } = props;

  const { formData, isLoading, isError } = getFormData(menuSelect.baseId);

  const [selectForm, setSelectForm] = useState(0);
  const handleChange = (event, newValue) => {
    setSelectForm(newValue);
    const setForm = { form: formData[newValue].prodForm, add: [] };
    handleMenuValue(setForm);
  };

  const [menuValue, setMenuValue] = useState({ form: "", add: [] });
  const handleMenuValue = (newValue) => {
    setMenuValue(newValue);
  };

  if (isError) return <div>failed to load</div>;
  if (isLoading)
    return (
      <>
        <Box sx={{ width: 300 }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
      </>
    );

  return (
    <>
      <Toolbar>{menuSelect.baseName}</Toolbar>
      <div
        className="md:flex-none lg:grow lg:flex "
        //sx={{ flexGrow: 1,  display: {md: 'flex', sm: 'none'} }}
      >
        {formData && (
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={selectForm}
            onChange={handleChange}
            aria-label="Vertical tabs"
            allowScrollButtonsMobile
            TabScrollButtonProps={{
              disableRipple: true,
            }}
            TabIndicatorProps={{
              style: { display: "none" },
            }}
            className=" md:w-full lg:w-1/3 divide-x-2 divide-x-reverse "
          >
            {formData?.map((form, index) => (
              <Tab
                wrapped
                disableRipple
                sx={{
                  "&.MuiTab-root": {
                    maxWidth: "none",
                  },
                }}
                key={index}
                label={
                  <div className="flex flex-row items-center justify-evenly w-full">
                    <p className="text-2xl">{form.prodForm}</p>
                    <p className="text-2xl">฿ {form.price}</p>
                  </div>
                }
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        )}
        <div className="flex flex-col md:w-full lg:w-2/3 h-full">
          <div className="px-5 pb-5 absolute bg-white	w-full	z-10">เพิ่มเติม</div>
          <div className="pt-10 overflow-y-scroll lg:h-full h-2/3  md:h-full">
            {formData &&
              formData?.map((form, index) => (
                <TabPanel
                  value={selectForm}
                  index={index}
                  key={index}
                  className="flex flex-col items-center justify-between"
                >
                  {form.addOnOption?.map((addOn, index) => (
                    // <div
                    //   key={index}
                    //   className="mb-5 rounded-lg border-1 shadow-md w-5/6"
                    // >
                    //   <div className="flex flex-row">
                    //     <div className="p-3 text-xl">{addOn.addOnTitle}</div>
                    //     {addOn?.isManyOptions ? (
                    //       <div className="pt-4 text-gray-400">
                    //         เลือกได้หลายตัวเลือก
                    //       </div>
                    //     ) : (
                    //       <div className="pt-4 text-gray-400">
                    //         เลือกได้ 1 ตัวเลือก
                    //       </div>
                    //     )}
                    //   </div>
                    //   <div>
                    //     {addOn.options?.map((option, index) => (
                    //       <div
                    //         key={index}
                    //         className=" mx-5 text-gray-500 flex items-center "
                    //       >
                    //         <Checkbox />
                    //         {selectForm === index ? (
                    //           <div className="flex items-center justify-between p-2 text-blue-400 w-full">
                    //             <div>{option.optionName}</div>
                    //             <div>+ {option.price}</div>
                    //           </div>
                    //         ) : (
                    //           <div className="flex items-center justify-between p-2 w-full">
                    //             <div>{option.optionName}</div>
                    //             <div>+ {option.price}</div>
                    //           </div>
                    //         )}
                    //       </div>
                    //     ))}
                    //   </div>
                    // </div>
                    <div
                      key={index}
                      className="mb-5 rounded-lg border-1 shadow-md w-5/6"
                    >
                      <AddOnBox addOn={addOn} />
                    </div>
                  ))}
                </TabPanel>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////   add on box
function AddOnBox(props) {
  const { addOn } = props;

  const [selectValue, setSelectValue] = useState("");

  const handleChecked = (event) => {
    console.log(event.target.value);
    setSelectValue(event.target.value);
  };

  return (
    <>
      <div className="flex flex-row">
        <div className="p-3 text-xl">{addOn.addOnTitle}</div>
        {addOn?.isManyOptions ? (
          <div className="pt-4 text-gray-400">เลือกได้หลายตัวเลือก</div>
        ) : (
          <div className="pt-4 text-gray-400">เลือกได้ 1 ตัวเลือก</div>
        )}
      </div>
      <>
        <RadioGroup
          aria-labelledby="controlled-radio-buttons-group"
          name="controlled-radio-group"
          value={selectValue}
          onChange={handleChecked}
        >
          {addOn.options?.map((option, index) => (
            <div key={index} className=" mx-5 text-gray-500 flex items-center ">
              <FormControlLabel
              className="w-full"
                value={option.optionId}
                control={<Radio />}
                label={
                  <div className="flex items-center justify-between w-full">
                    <div>{option.optionName}</div>
                    <div>+ {option.price}</div>
                  </div>
                }
                sx={{
                  "& .MuiTypography-root": {
                    width: "100%"
                  }
                }}
              />
            </div>
          ))}
        </RadioGroup>
      </>
    </>
  );
}

const CheckInput = ({ option, onChange }) => {
  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: false,
  });
  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={true}
            onChange={handleChange}
            name={option.optionName}
          />
        }
        label={option.optionName}
      />
      <div>+ {option.price}</div>
    </>
  );
};

// const CheckInput = ({ label, value, onChange }) => {
//   return (
//     <label>
//       <input type="checkbox" checked={value} onChange={onChange} />
//       {label}
//     </label>
//   );
// };

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
      {/* { children } */}
      {value === index && <>{children}</>}
    </div>
  );
}

const fetcher = (url) => axios.get(url).then((res) => res.data.res);
const getFormData = (baseId) => {
  const { data, error, isLoading } = useSWR(
    `${BaseURL}${findProductFormByBaseId}${baseId}&${haveAddOn}&${haveOption}`,
    fetcher
  );
  return {
    formData: data,
    isLoading,
    isError: error,
  };
};
