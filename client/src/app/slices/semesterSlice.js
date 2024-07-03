import { createSlice } from "@reduxjs/toolkit";
const initialValue = {
  semesters: {},
  semester: {},
  sid: "",
  usersInSmt: {},
  smtDet: "",
};
const semesterSlice = createSlice({
  name: "semester",
  initialState: initialValue,
  reducers: {
    setSemesters: (state, action) => {
      state.semesters = action.payload;
    },
    setSid: (state, action) => {
      state.sid = action.payload;
    },
    setSemester: (state, action) => {
      state.semester = action.payload;
    },
    setUsersInSmt: (state, action) => {
      state.usersInSmt = action.payload;
    },
    setSmtDet: (state, action) => {
      state.smtDet = action.payload;
    },
  },
});

const { reducer, actions } = semesterSlice;
export const { setSemesters, setSid, setSemester, setUsersInSmt, setSmtDet } = actions;
export default reducer;
