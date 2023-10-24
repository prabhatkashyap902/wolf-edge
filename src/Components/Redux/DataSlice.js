import { createSlice } from '@reduxjs/toolkit';

const DataSlice = createSlice({
  name: 'data',
  initialState: {
    value: [],
  },
  reducers: {
    saveData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { saveData } = DataSlice.actions;
export default DataSlice.reducer;