import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pageIndex: 0,
    basket: [],
  }

  export const selectSlice = createSlice({
    name: 'selectMenus',
    initialState,
    reducers: {
    
      // decrement: (state) => {
      //   state.value -= 1
      // },
     
      // onClickPageIndex: (state , action) => {
      //   state.pageIndex = action.payload;
        
      // },

      onClickSelect: (state , action) => {
        state.basket.push(action.payload);
        console.log(state.basket);
      },
    },
  })

export const { onClickSelect } = selectSlice.actions
export const selectMenu = (state) => state.selectMenus.basket
export default selectSlice.reducer;