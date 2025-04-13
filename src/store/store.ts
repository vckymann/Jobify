import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import noopStorage from 'redux-persist/lib/storage'

import jobsSlice from "./slices/jobsSlice"

const rootReducer = combineReducers({
    jobs: jobsSlice,
});

const persistConfig = {
    key: 'root',
    storage: typeof window !== 'undefined' ? storage : noopStorage,
    version: 1,
    whitelist: ['jobs'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;