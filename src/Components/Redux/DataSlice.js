import { createSlice } from '@reduxjs/toolkit';

const DataSlice = createSlice({
	name: 'data',
	initialState: {
		contract: '',
		signers:'',
		providers:'',
		webSocketContract:'',
		player1Address:'',
		player2Address:''
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
		},
		setPlayer1Address:(state,action)=>{
			state.player1Address=action.payload
		},
		setPlayer2Address:(state,action)=>{
			state.player2Address=action.payload
		}
	},
});

export const { setContracts,setSigners,setProviders,setWebSocketContracts,setPlayer1Address,setPlayer2Address } = DataSlice.actions;
export default DataSlice.reducer;