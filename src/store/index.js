// store.js  

import { configureStore, getDefaultMiddleware  } from '@reduxjs/toolkit';  
import gameReducer from './gameSlice';  

const store= configureStore({  
  reducer: {  
    game: gameReducer,  
  },  
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(), 
}); 

export default store; 
// src/index.js or where you set up the WebSocket  

