import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FilledInput,
  FormControl,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import "../style/store.css";
import { styled, StyledEngineProvider } from "@mui/material/styles";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import NoteIcon from "@mui/icons-material/Note";
import DiscountIcon from "@mui/icons-material/Discount";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

//// styled
const MainBox = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
}));

const BodymBox = styled(Box)(() => ({
  width: "100%",
  height: "calc(100% - 219px)",
  overflow: "scroll",
}));

const BottomBox = styled(Box)(() => ({
  position: "absolute",
  bottom: 0,
  width: "100%",
  gap: "5px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-evenly",
  padding: "10px 0",
  backgroundColor: "#EAEFF1",
}));

const StyledBox = styled(Box)(() => ({
  display: "flex",
  flexdirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "90%",
}));

const ConfirmButton = styled(Button)(() => ({
  borderRadius: "20px",
  height: "3rem",
  width: "16rem",
  backgroundColor: "#07A0DC",
  "&:hover": {
    backgroundColor: "#07A0DC",
    borderColor: "#07A0DC",
    boxShadow: "none",
  },
}));

const FillOneLine = styled(FilledInput)(() => ({
  ".MuiFilledInput-input": {
    padding: "8px 12px 9px",
  },
}));

// const Textf = styled(TextField)(() => ({
//   "& .MuiFilledInput-root:before": {
//     borderBottom: "0px"
//   },
//   "& .MuiFilledInput-root:after": {
//     borderBottom: "0px"
//   },
//   "& .MuiFilledInput-root:hover:before": {
//     borderBottom: "0px"
//   },
// }));

///// theme
const theme = createTheme({
  palette: {
    neutral: {
      main: "#ffffff",
    },
    // confirm: {
    //   main: "#07A0DC",
    // },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiAccordion: {
      defaultProps: {
        square: true,
      },
      styleOverrides: {
        root: {
          borderRadius: "20px",
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        // root: {
        //   "&.Mui-expanded": {
        //     minHeight: "36px",
        //   },
        // },
        content: {
          "&.Mui-expanded": {
            margin: "auto",
          },
        },
      },
    },
    // MuiFilledInput: {
    //   defaultProps: {
    //     disableUnderline: true,
    //   },
    // },
    MuiTextField: {
      defaultProps: {
        hiddenLabel: true,
        fullWidth: true,
      },
    },
  },
});

const bodyBoxs = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25,
];

export default function BasketPopup() {
  const [expandedBox, setExpandedBox] = useState(false);
  const [expandedPoint, setExpandedPoint] = useState(false);

  const handleExpandedBox = (panel) => (event, isExpanded) => {
    setExpandedBox(isExpanded ? panel : false);
  };

  const handleExpandedPoint = (open) => () => {
    setExpandedPoint(open);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* <StyledEngineProvider injectFirst> */}
        <>
          <Toolbar sx={{ fontSize: "40px" }}> ตะกร้า </Toolbar>

          <MainBox>
            <BodymBox>
              {bodyBoxs.map((b, index) => (
                <Typography sx={{ fontSize: "2rem" }} key={index}>
                  {b}
                </Typography>
              ))}
            </BodymBox>
            <BottomBox>
              <StyledBox>
                <Typography>ข้อความ</Typography>
                <Accordion
                  expanded={expandedBox === "panel1"}
                  onChange={handleExpandedBox("panel1")}
                  sx={{ width: "70%" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <NoteIcon sx={{ width: "33%", flexShrink: 0 }} />
                    <Typography sx={{ color: "text.secondary" }}>
                      เพิ่มข้อความ
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {/* <TextField
                      multiline
                      variant="filled"
                      placeholder="ข้อความถึงผู้ขาย"
                    /> */}
                    <FormControl fullWidth variant="filled">
                      <FilledInput
                        size="small"
                        placeholder="ข้อความถึงผู้ขาย"
                        disableUnderline
                        multiline
                      />
                    </FormControl>
                  </AccordionDetails>
                </Accordion>
              </StyledBox>
              <StyledBox>
                <Typography>ล่วนลด</Typography>

                <Accordion
                  //id="ac"
                  expanded={expandedBox === "panel2"}
                  onChange={handleExpandedBox("panel2")}
                  sx={{ width: expandedBox === "panel2" ? "90%" : "70%" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel1bh-header"
                  >
                    <DiscountIcon sx={{ width: "33%", flexShrink: 0 }} />
                    <Typography sx={{ color: "text.secondary" }}>
                      เพิ่มส่วนลด
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl fullWidth variant="filled">
                      <FillOneLine
                        size="small"
                        placeholder="เบอร์โทรศัพท์"
                        disableUnderline
                      />
                      <Button
                        variant="contained"
                        onClick={handleExpandedPoint(true)}
                      >
                        ตรวจสอบ
                      </Button>
                      {expandedPoint && (
                        <>
                          <Typography align="center">
                            คุณมี : XXXX แต้ม
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-evenly",
                              flexDirection: "row",
                            }}
                          >
                            <Typography>ใช้</Typography>
                            <Box
                              sx={{
                                borderRadius: "20px",
                                borderColor: "divider",
                                borderWidth: 3,
                              }}
                            >
                              <Button>+</Button>
                              {/* value point */}
                              100
                              <Button>-</Button>
                            </Box>
                          </Box>
                          <Button variant="contained">ใช้แต้มสะสม</Button>
                          <Typography align="center" color="red">
                            *{/* point rate  */}
                            100 แต้ม = 1 บาท
                          </Typography>
                        </>
                      )}
                    </FormControl>
                  </AccordionDetails>
                </Accordion>
              </StyledBox>
              <StyledBox>
                <Typography align="left" sx={{ fontSize: "2rem" }}>
                  รวมราคา
                </Typography>
                <Typography
                  align="right"
                  sx={{ width: "50%", fontSize: "2rem" }}
                >
                  00000
                </Typography>
              </StyledBox>
              <ConfirmButton variant="contained">
                <Typography
                  sx={{
                    p: 2,
                    color: "white",
                    //"text.secondary"
                  }}
                >
                  ยันยืนการสั่งซื่้อ
                </Typography>
              </ConfirmButton>
            </BottomBox>
          </MainBox>
        </>

        {/* </StyledEngineProvider> */}
      </ThemeProvider>
    </>
  );
}
