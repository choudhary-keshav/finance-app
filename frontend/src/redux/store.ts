import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authenticationReducer from "./features/authenticationSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { authApi } from "./services/authApi";
import { transactionApi } from "./services/viewTransactionApi";
import saveExcelApi from "./services/saveExcelApi";
import { editTransactionApi } from "./services/editTransactionApi";
import { deleteTransactionApi } from "./services/deleteTransactionApi";

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  [authApi.reducerPath]: authApi.reducer,
  [transactionApi.reducerPath]: transactionApi.reducer,
  [saveExcelApi.reducerPath]: saveExcelApi.reducer,
  [editTransactionApi.reducerPath]: editTransactionApi.reducer,
  [deleteTransactionApi.reducerPath]: deleteTransactionApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  blacklist: [
    "authentication",
    saveExcelApi.reducerPath,
    editTransactionApi.reducerPath,
    deleteTransactionApi.reducerPath,
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }).concat(
      authApi.middleware,
      transactionApi.middleware,
      saveExcelApi.middleware,
      editTransactionApi.middleware,
      deleteTransactionApi.middleware
    ),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
