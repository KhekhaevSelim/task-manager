import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState : InitialStateType = {
    status : "idle",
    error : null
}

const slice = createSlice({
    name : "app",
    initialState : initialState,
    reducers : {
        setErrorAC(state, action: PayloadAction<{error : null | string}>){
            state.error = action.payload.error
        },
        setAppStatusAC(state, action : PayloadAction<{ status : RequestStatusType}>){
            state.status = action.payload.status
        }
    }
})
export const appReducer = slice.reducer
export const {setErrorAC, setAppStatusAC} = slice.actions
export type InitialStateType = {
    status : RequestStatusType,
    error : string | null
}
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
