import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { useNavigate } from "react-router-dom";


const categories = [
  {
    id: "Build",
    children: [
      {
        id: "Dashboard",
        //icon: <PeopleIcon />,
        navigete: "/dashboard",
      },
      {
        id: "Product",
        // icon: <DnsRoundedIcon />
        navigete: "/product",
      },
      {
        id: "Storage",
        //icon: <PermMediaOutlinedIcon />,
      },
      {
        id: "Hosting",
        //icon: <PublicIcon />,
      },
      {
        id: "Functions",
        //icon: <SettingsEthernetIcon />,
      },
      {
        id: "Machine learning",
        //icon: <SettingsInputComponentIcon />,
      },
    ],
  },
  {
    id: "Quality",
    children: [
      {
        id: "Analytics",
        //icon: <SettingsIcon />
      },
      {
        id: "Performance",
        //icon: <TimerIcon />
      },
      {
        id: "Test Lab",
        //icon: <PhonelinkSetupIcon />
      },
    ],
  },
];

const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};




export default function EmpDrawer(props) {
  const { ...other } = props;
  let navigate = useNavigate();

  const [pageSelect, setPageSelect] = useState({
    subSelect: localStorage.getItem("subSelect") || "",
    mainSelect: localStorage.getItem("mainSelect") || "",
  });

  const handlePageSelect = (indexSub, indexMain) => {
    setPageSelect({
      subSelect: indexSub,
      mainSelect: indexMain,
    });
    localStorage.setItem("subSelect", indexSub);
    localStorage.setItem("mainSelect", indexMain);
  };

  console.log(pageSelect);

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          sx={{ ...item, ...itemCategory, fontSize: 22, color: "#fff" }}
        >
          Paperbase
        </ListItem>
        <ListItem sx={{ ...item, ...itemCategory }}>
          <ListItemIcon>{/* <HomeIcon /> */}</ListItemIcon>
          <ListItemText>Project Overview</ListItemText>
        </ListItem>
        {categories.map(({ id: cateId, children }, indexMain) => (
          <Box key={cateId} sx={{ bgcolor: "#101F33" }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: "#fff" }}>{cateId}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, navigete }, indexSub) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton
                  selected={
                    indexSub == pageSelect.subSelect &&
                    indexMain == pageSelect.mainSelect
                  }
                  sx={item}
                  onClick={() => {
                    handlePageSelect(indexSub, indexMain);
                    navigate(navigete);
                  }}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
