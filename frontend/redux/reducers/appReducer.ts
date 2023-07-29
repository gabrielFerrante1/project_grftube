import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 

export const slice = createSlice({
    name: 'auth',
    initialState: {
        layout_menu_active: true,
    },
    reducers: {
        setLayoutMenuActive: (state, action: PayloadAction<boolean>) => {
            state.layout_menu_active = action.payload
        },
    }
});

//Exportando ações do reducer
export const { setLayoutMenuActive } = slice.actions;

export default slice.reducer;