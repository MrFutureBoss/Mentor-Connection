import { createSlice } from "@reduxjs/toolkit";
const initialValue = {
  pageNo: 0,
  limit: 10,
  search: "",
};
const mockupSlice = createSlice({
  name: "utilities",
  initialState: initialValue,
  reducers: {
    setPageNo: (state, action) => {
      state.pageNo = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

const { reducer, actions } = mockupSlice;
export const { setPageNo, setLimit, setSearch } = actions;
export default reducer;
