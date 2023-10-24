import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './DataSlice';

export const ReduxStore = configureStore({
  reducer: {
    data: dataReducer,
  },
});
