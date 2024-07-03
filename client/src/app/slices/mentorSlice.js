import { createSlice } from "@reduxjs/toolkit";
const initialValue = {
  mentorGroups: [],
};
const mentorSlice = createSlice({
  name: "mentor",
  initialState: initialValue,
  reducers: {
    setMentorGroups: (state, action) => {
      state.mentorGroups = action.payload;
    },
  },
});

const { reducer, actions } = mentorSlice;
export const { setMentorGroups } = actions;
export default reducer;
