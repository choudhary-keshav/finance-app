import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "../../utils/interfaces/interface";
const initialState: UserState = {
  data: {
    _id: "",
    name: "",
    email: "",
    pic: "",
    createdAt: "",
    updatedAt: "",
    __v: 0,
  },
};

export const authnticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },
  },
});
export const { setUser } = authnticationSlice.actions;
export default authnticationSlice.reducer;
