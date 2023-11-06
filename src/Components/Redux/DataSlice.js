import { createSlice } from '@reduxjs/toolkit';

const DataSlice = createSlice({
  name: 'data',
  initialState: {
    contract: '',
    signers:{},
    providers:{},
    webSocketContract:''
  },
  reducers: {
    setContracts: (state, action) => {
      state.contract = action.payload;
    },
    setSigners: (state, action) => {
      state.signers = action.payload;
    },
    setProviders: (state, action) => {
      state.providers = action.payload;
    },
    setWebSocketContracts:(state,action)=>{
      state.webSocketContract=action.payload
    }
  },
});

export const { setContracts,setSigners,setProviders,setWebSocketContracts } = DataSlice.actions;
export default DataSlice.reducer;