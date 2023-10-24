import { createSlice } from '@reduxjs/toolkit';

const DataSlice = createSlice({
  name: 'data',
  initialState: {
    contract: [],
  },
  reducers: {
    setContracts: (state, action) => {
      state.contract = action.payload;
    },
  },
});

export const { setContracts } = DataSlice.actions;
export default DataSlice.reducer;