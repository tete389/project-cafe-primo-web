import { configureStore } from "@reduxjs/toolkit";
import  selectReducer  from "../features/selectSlice";

export const store = configureStore({
    reducer: {

      selectMenus: selectReducer,

    },
  })
