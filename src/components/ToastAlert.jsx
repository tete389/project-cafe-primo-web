/* eslint-disable react/prop-types */
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "../style/order.css";

export default function ToastAlert(props) {
  const { children, alertColor, isShow } = props;

  return (
    <>
      {isShow && (
        <div className="toast toast-top toast-end">
          <div className={`alert ${alertColor}`}>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
