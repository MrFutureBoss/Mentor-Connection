import { createSlice } from "@reduxjs/toolkit";
const initialValue = {
  project: {},
  projectCategories: [],
};
const projectSlice = createSlice({
  name: "project",
  initialState: initialValue,
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload;
    },
    setProjectCategories: (state, action) => {
      state.projectCategories = action.payload;
    },
  },
});

const { reducer, actions } = projectSlice;
export const { setProject, setProjectCategories } = actions;
export default reducer;
