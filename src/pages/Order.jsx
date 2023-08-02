import { Accordion, AccordionDetails, AccordionSummary, Box, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Order() {
  
  let navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div>
      <p>Order</p>
      {/* <button onClick={() => navigate("/back")}>Back redirect</button>
      <button onClick={() => navigate("/", {state: "From Order"})}>Back navigate</button> */}
       <Box sx={{ width: "70%" }}>
                <Accordion
                  //className="acMuiPaper-rootMuiAccordion-root"
                  expanded={expanded === "panel1"}
                  onChange={handleChange("panel1")}
                >
                  <AccordionSummary
                    //expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    //id="panel1bh-header"
                    sx={{}}
                  >
                    {/* <NoteIcon sx={{ width: "33%", flexShrink: 0 }} /> */}
                    <Typography sx={{ color: "text.secondary" }}>
                      เพิ่มข้อความ
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      multiline
                      hiddenLabel
                      variant="filled"
                      fullWidth
                      placeholder="เพิ่มข้อความ"
                    />
                  </AccordionDetails>
                </Accordion>
              </Box>
    </div>
  )
}

export default Order