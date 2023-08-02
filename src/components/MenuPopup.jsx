import { SwipeableDrawer, Toolbar } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

const baseURL = "https://domains-substance-equity-bones.trycloudflare.com";

export default function MenuPopup(props) {
  const { menuSelect } = props;

  const [res, setRes] = useState("");



  useEffect(() => {
    getFormOption(menuSelect.baseId);
  }, []);

  console.log(res);
  return (
    <>
      <Toolbar>{menuSelect.baseName}</Toolbar>
    </>
  );
}


const getFormOption = async (baseId) => {
  const response = await axios
    .post(
      `${baseURL}/product/getProductFormInfoAddOnListOptionInfoByProductBaseId/?baseId=${baseId}`
    )
    .then(function (response) {
      console.log(response.data.res);
    })
    .catch(function (error) {
      console.log(error);
    });

    return response.data.res;
};