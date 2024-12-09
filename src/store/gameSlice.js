import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';  
import axios from 'axios';  
import { toast } from 'react-toastify';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const initialState = {  
  balances: [],
  currency: '',
  betPath : [],
  betStatus: 0,
  multipliers:[]
};  

export const initGame = createAsyncThunk('game/initGame', async ({ rows, risk }, { getState, rejectWithValue }) => {  
  try {  
    const url = serverUrl + "/init-game";
    const token = localStorage.getItem('plinko-token');   

    const data = {
      token : token ?? "",
      rows,
      risk
    }

    const response = await axios.post(url, data);  // Changed to POST to handle sending data    
    return response.data;  
  } catch (error) {  
    return rejectWithValue(error.response.data);  
  }  
}); 

export const reloadBalance = createAsyncThunk('game/reloadBalance', async ({  }, { getState, rejectWithValue }) => {  
  try {  
    const url = serverUrl + "/game-result";
    const token = localStorage.getItem('plinko-token');   
    
    const data = {
      token : token ?? "",
    }

    const response = await axios.post(url, data);  // Changed to POST to handle sending data    
    return response.data;  
  } catch (error) {  
    return rejectWithValue(error.response.data);  
  }  
}); 

export const startBet = createAsyncThunk('game/startBet', async ({ betAmount, risk, rows }, { getState, rejectWithValue }) => {  
  try {  
    const url = serverUrl + "/start-game";
    const state = getState();
    const token = localStorage.getItem('plinko-token');   
    const mtoken = localStorage.getItem('plinko-mtoken');   
    const client_seed = localStorage.getItem('client-seed');   
    const currency = state.game.currency;

    const data = {
      token : token ?? "",
      mtoken : mtoken ?? "",
      betAmount,
      client_seed: client_seed ?? "",
      currency,
      risk,
      rows
    }

    const response = await axios.post(url, data);  // Changed to POST to handle sending data    
    return response.data;  
  } catch (error) {  
    return rejectWithValue(error.response.data);  
  }  
}); 

export const gameSlice = createSlice({  
  name: 'game',  
  initialState,  
    reducers: {      
    setCurrency: (state, action) => {        
      state.currency = action.payload;  
    },    
  },  
  extraReducers: (builder) => {  
    builder.addCase(initGame.fulfilled, (state, action) => {  
      state.balances = action.payload.balances
      state.multipliers = action.payload.multipliers
      localStorage.setItem('plinko-token', action.payload.token) 
      localStorage.setItem('plinko-mtoken', action.payload.mtoken) 
    })
    builder.addCase(reloadBalance.fulfilled, (state, action) => {  
      state.balances = action.payload.balances
    })
    builder.addCase(startBet.fulfilled, (state, action) => {  
      const status = action.payload.bet_status
      state.betStatus = status

      if(status == 1) {
        state.betPath = action.payload.path;
        state.balances = action.payload.balances;
      }            
    });  
  }  
});  

export const {  setCurrency} = gameSlice.actions;  

export default gameSlice.reducer;