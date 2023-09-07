import {createSlice} from '@reduxjs/toolkit';


const authSlice=createSlice({
    name:'auth',
    initialState:{
        token:localStorage.getItem('token') || null
    },
    reducers:{
        setToken:(state,action)=>{
            const {token}=action.payload;
            state.token=token
        },
        logout:(state,action)=>{
            state.token=null;
        }

    }

})

export const{setToken,logout}=authSlice.actions;
export default authSlice.reducer;