import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connected: false,
  pubkey: null,
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
    setPubKey: (state, action) => {
      state.pubkey = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setInvoice: (state, action) => {
      state.invoice = action.payload;
    },
    setPaid: (state, action) => {
      state.paid = action.payload;
    },
    setPolling: (state, action) => {
      state.polling = action.payload;
    },
  },
});

export const {
  setConnected,
  setPubKey,
  setAmount,
  setInvoice,
  setPaid,
  setPolling,
} = lightningSlice.actions;

export default lightningSlice.reducer;
