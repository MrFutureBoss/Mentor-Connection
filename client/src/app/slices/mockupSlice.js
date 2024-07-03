import { createSlice } from "@reduxjs/toolkit";
const initialValue = {
  taughtClassMockup: false,
};
const mockupSlice = createSlice({
  name: "mockup",
  initialState: initialValue,
  reducers: {
    setTaughtClassMockup: (state, action) => {
      state.taughtClassMockup = action.payload;
    },
  },
});

const { reducer, actions } = mockupSlice;
export const { setTaughtClassMockup } = actions;
export default reducer;
