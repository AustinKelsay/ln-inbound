import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connected: false,
  amount: 50,
  invoice: null,
  polling: false,
  paid: false,
  txid: null,
};

export const lightningSlice = createSlice({
  name: "lightning",
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setInvoice: (state, action) => {
      state.invoice = action.payload;
    },
    setPolling: (state, action) => {
      state.polling = action.payload;
    },
  },
});

export const { setConnected, setAmount, setInvoice, setPolling } =
  lightningSlice.actions;

export default lightningSlice.reducer;
