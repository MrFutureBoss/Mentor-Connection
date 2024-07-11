import { createSlice } from "@reduxjs/toolkit";
const initialValue = {
  project: {},
  projectCategories: [],
  loading: false,
  projectRequest: [],
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
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    approveProject(state, action) {
      const projectId = action.payload;
      const projectIndex = state.projectsapproveProject.findIndex(
        (project) => project._id === projectId
      );
      if (projectIndex !== -1) {
        state.projectsapproveProject[projectIndex].approved = true; // Assuming there's an 'approved' field
      }
    },
  },
});

const { reducer, actions } = projectSlice;
export const {
  setProject,
  setProjectCategories,
  setProjectRequest,
  setLoading,
  setError,
  approveProject,
} = actions;
export default reducer;
