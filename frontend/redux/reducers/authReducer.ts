import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';

export const slice = createSlice({
    name: 'auth',
    initialState: {
        is_authenticated: false,
        modal_login: false,
        user: null as User | null,
        token_access: '' as string,
    },
    reducers: {
        setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.is_authenticated = action.payload
        },
        setToggleModalLogin: (state, action: PayloadAction<boolean>) => {
            state.modal_login = action.payload
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload
        },
        setTokenAccess: (state, action: PayloadAction<string>) => {
            state.token_access = action.payload
        },
    }
});

//Exportando ações do reducer
export const { setIsAuthenticated, setToggleModalLogin, setUser, setTokenAccess } = slice.actions;

export default slice.reducer;