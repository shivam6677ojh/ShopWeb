import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    _id: "",
    name: "",
    email: "",
    mobile: "",
    status: "",
    last_login_date: ""
};

const agentSlice = createSlice({
    name: "agent",
    initialState: initialValue,
    reducers: {
        setAgentDetails: (state, action) => {
            state._id = action.payload?._id || "";
            state.name = action.payload?.name || "";
            state.email = action.payload?.email || "";
            state.mobile = action.payload?.mobile || "";
            state.status = action.payload?.status || "";
            state.last_login_date = action.payload?.last_login_date || "";
        },
        clearAgentDetails: (state) => {
            state._id = "";
            state.name = "";
            state.email = "";
            state.mobile = "";
            state.status = "";
            state.last_login_date = "";
        }
    }
});

export const { setAgentDetails, clearAgentDetails } = agentSlice.actions;

export default agentSlice.reducer;
