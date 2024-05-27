import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authenticationReducer from "./features/authenticationSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { authApi } from "./services/authApi";
import { transactionApi } from "./services/viewTransactionApi";
const rootreducer = combineReducers({ authentication: authenticationReducer, [authApi.reducerPath]: authApi.reducer, [transactionApi.reducerPath]:transactionApi.reducer });

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  blacklist: ["authentication"],
};
const persisireducer = persistReducer(persistConfig, rootreducer);
export const store = configureStore({
  reducer: persisireducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }).concat(authApi.middleware, transactionApi.middleware),
});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
