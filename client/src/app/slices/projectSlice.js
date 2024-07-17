import { createSlice } from "@reduxjs/toolkit";
const initialValue = {
  project: {},
  projectCategories: [],
  loading: false,
  projectRequest: {},
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
    setProjectRequest: (state, action) => {
      state.projectRequest = action.payload;
    },
  },
});

const { reducer, actions } = projectSlice;
export const { setProject, setProjectCategories, setProjectRequest } = actions;
export default reducer;
