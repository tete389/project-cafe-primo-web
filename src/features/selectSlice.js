import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pageIndex: 0,
  }

  export const selectSlice = createSlice({
    name: 'selectPageIndex',
    initialState,
    reducers: {
    
      decrement: (state) => {
        state.value -= 1
      },
     
      onClickPageIndex: (state , action) => {
        state.pageIndex = action.payload;
        
      },
    },
  })

export const { increment, decrement, onClickPageIndex } = selectSlice.actions
export const selectPage = (state) => state.selectPageIndex.pageIndex
export default selectSlice.reducer;