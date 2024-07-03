import { createSlice } from "@reduxjs/toolkit";
const initialValue = {
  groups: [],
  selectedGroupId: null,
  group: {},
  allGroups: [],
};
const groupSlice = createSlice({
  name: "group",
  initialState: initialValue,
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setSelectedGroupId: (state, action) => {
      state.selectedGroupId = action.payload;
    },
    setGroup: (state, action) => {
      state.group = action.payload;
    },
    setAllGroup: (state, action) => {
      state.allGroups = action.payload;
    },
  },
});

const { reducer, actions } = groupSlice;
export const { setGroups, setSelectedGroupId, setGroup, setAllGroup } = actions;
export default reducer;
