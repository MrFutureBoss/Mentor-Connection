import { createSlice } from "@reduxjs/toolkit";
const initialValue = {
  categories: {
    data: [],
    total: 0,
  },
  category: {},
  delCat: {},
  editCat: {},
  mentorCategories: {
    data: [],
  },
  cid: "",
};
const classSlice = createSlice({
  name: "category",
  initialState: initialValue,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setMentorCategories: (state, action) => {
      state.mentorCategories = action.payload;
    },
    setCid: (state, action) => {
      state.cid = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setDelCat: (state, action) => {
      state.delCat = action.payload;
    },
    setEditCat: (state, action) => {
      state.editCat = action.payload;
    },
  },
});

const { reducer, actions } = classSlice;
export const { setCategories, setMentorCategories, setCid, setCategory, setDelCat } = actions;
export default reducer;
