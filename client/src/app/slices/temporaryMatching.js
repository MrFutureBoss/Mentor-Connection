import { createSlice } from "@reduxjs/toolkit";
const initialValue = {
  temporaryMatching: {
    data: [],
    count: 0,
    limit: 10,
    skip: 0,
  },
  pageNo: 0,
  searchValue: "",
  mentorChoice: {},
  delMatched: {},
};
const storiesSlice = createSlice({
  name: "temporaryMatching",
  initialState: initialValue,
  reducers: {
    setTemporaryMatching: (state, action) => {
      state.temporaryMatching = action.payload;
    },
    setMentorChoice: (state, action) => {
      state.mentorChoice = action.payload;
    },
    setPageNo: (state, action) => {
      state.pageNo = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setDelMatched: (state, action) => {
      state.delMatched = action.payload;
    },
  },
});

const { reducer, actions } = storiesSlice;
export const { setTemporaryMatching, setMentorChoice, setPageNo, setSearchValue, setDelMatched } =
  actions;
export default reducer;
