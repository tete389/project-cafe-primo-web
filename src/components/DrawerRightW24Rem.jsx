import { Drawer } from "@mui/material";

export default function DrawerRightW24Rem(params) {
  const { children } = params;
  return (
    <Drawer
      anchor="right"
      ModalProps={{
        keepMounted: true,
      }}
      variant="permanent"
      sx={{
        flexShrink: 0,
        zIndex: "100",
        display: { xs: "none", sm: "none", md: "block" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          overflow: "hidden",
          // height: "80%",
          // top: "10%",
          marginTop: "100px",
        },
      }}
      open
    >
      {children}
    </Drawer>
  );
}
