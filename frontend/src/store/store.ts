import { configureStore } from '@reduxjs/toolkit';
import { fileManagementApi } from './FileManagementApi';

const store = configureStore({
  reducer: {
    [fileManagementApi.reducerPath]: fileManagementApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(fileManagementApi.middleware),
  
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
