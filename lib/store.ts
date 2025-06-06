import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "./storage";
// import storage from "redux-persist/lib/storage"
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import leaveReducer from "./features/leave/leaveSlice";
import adminReducer from "./features/admin/adminSlice";
import uiReducer from "./features/ui/uiSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "ui"], // Only persist auth and ui state
};

const rootReducer = combineReducers({
  auth: authReducer,
  leave: leaveReducer,
  admin: adminReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
