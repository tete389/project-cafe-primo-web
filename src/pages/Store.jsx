/* eslint-disable react-hooks/rules-of-hooks */
import {
  Container,
  Fab,
  Tab,
  Tabs,
  AppBar,
  SwipeableDrawer,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import { tabsClasses } from "@mui/material/Tabs";
import PropTypes from "prop-types";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useEffect, useState } from "react";
import useSWR from "swr";
// import "../style/store.css";

import BasketPopup from "../components/BasketPopup";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BaseURL,
  findCategoryAll,
  haveBase,
  haveMinPriceIc,
} from "../service/BaseURL";
import Menu from "./Menu";

export default function Store() {
  //const navigate = useNavigate();
  // const resCate = useLoaderData();

  //const { cateData, isLoading, isError } = getCategoryData();

  const [cateData, setCateData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [tabsValue, setTabsValue] = useState(0);
  const handleTabs = (event, newValue) => {
    setTabsValue(newValue);
  };

  const [openBasket, setOpenBasket] = useState(false);
  const handleOpenBasket = (newOpen) => () => {
    setOpenBasket(newOpen);
  };

  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BaseURL}${findCategoryAll}?${haveBase}&${haveMinPriceIc}`
        );
        const data = await response.data.res;
        setCateData(data);
      } catch (error) {
        console.error("Error fetching:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // if (isError) return <div>failed to load</div>;
  if (isError) {
    return <div>failed to load</div>;
  }

  if (isLoading) {
    return (
      <>
        <Box sx={{ width: 300 }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
      </>
    );
  }

  return (
    <Container>
      <AppBar sx={{ bgcolor: "white", height: "50px" }} elevation={0} />
      <AppBar sx={{ bgcolor: "transparent", top: "25px" }} elevation={0}>
        <Container
          align="center"
          maxWidth="sm"
          sx={{
            bgcolor: "white",
            borderColor: "divider",
            borderWidth: 3,
            borderRadius: "20px",
            "&.MuiContainer-root": {
              px: "0px",
            },
          }}
        >
          {cateData && (
            <Tabs
              value={tabsValue}
              onChange={handleTabs}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              //aria-label="visible arrows"
              //indicatorColor="opacity"
              TabIndicatorProps={{
                style: { display: "none" },
              }}
              TabScrollButtonProps={{
                disableRipple: true,
              }}
              sx={{
                "& .MuiTabs-scrollButtons": {
                  color: "black",
                },
                "& .MuiTabs-scroller": {
                  marginRight: "-10px",
                  marginLeft: "-10px",
                },
              }}
            >
              {cateData?.map((cate, index) => (
                <Tab
                  wrapped
                  disableRipple
                  key={index}
                  label={cate.cateName}
                  sx={{
                    my: 1,
                    bgcolor: tabsValue === index ? "#4fc3f7" : "#EAEFF1",
                    borderRadius: "20px",
                    mr: "15px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                />
              ))}
            </Tabs>
          )}
        </Container>
      </AppBar>
      {cateData &&
        cateData?.map((cate, index) => (
          <TabPanel value={tabsValue} index={index} key={index}>
            <Menu listMenu={cate.productBasePrice} />
          </TabPanel>
        ))}

      <Fab
        sx={{
          width: 70,
          height: 50,
          bgcolor: "#333333",
          position: "fixed",
          bottom: 25,
          right: 25,
          borderRadius: "12px",
        }}
        aria-label="backet"
        component="div"
        onClick={handleOpenBasket(true)}
      >
        <ShoppingBasketIcon sx={{ color: "white", fontSize: "35px" }} />
      </Fab>
      <SwipeableDrawer
        anchor="right"
        variant="temporary"
        open={openBasket}
        onClose={handleOpenBasket(false)}
        onOpen={handleOpenBasket(true)}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            borderRadius: "20px 0 0 20px",
            height: "98%",
            top: "1%",
            //width: { sm: 400, md: 400 },
            width: "25rem",
            overflow: "hidden",
          },
        }}
      >
        {openBasket && <BasketPopup />}
      </SwipeableDrawer>
    </Container>
  );
}

// export async function loaderStore() {
//   const response = await axios.get(
//     `${BaseURL}${findCategoryAll}?${haveBase}&${haveMinPriceIc}`
//   );
//   return response.data.res;
// }

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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const fetcher = (url) => axios.get(url).then((res) => res.data.res);
const getCategoryData = () => {
  const { data, error, isLoading } = useSWR(
    `${BaseURL}${findCategoryAll}?${haveBase}&${haveMinPriceIc}`,
    fetcher
  );

  return {
    cateData: data,
    isLoading,
    isError: error,
  };
};
