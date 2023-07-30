import { configureStore } from '@reduxjs/toolkit';
import appReducer from './reducers/appReducer';
import authReducer from './reducers/authReducer';
import playerReducer from './reducers/playerReducer';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        app: appReducer,
        player: playerReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;