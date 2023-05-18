import {LoginFormType} from "./Login";
import {AppThunkType} from "../../app/store";
import {APIAuth} from "../../DAL/API";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetWorkError} from "../../utils/error-utils/error-utils";
import {clearTodosDataAC} from "../todolistsList/Todolist/todolist-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn : false,
    isInitialized : false
}
const slice = createSlice({
    name : "auth",
    initialState : initialState,
    reducers : {
        setLoggedInAC(state, action: PayloadAction<{value : boolean}>){
            state.isLoggedIn = action.payload.value
        },
        setInitializedAC(state){
            state.isInitialized = true
        }
    }
})

export const authReducer = slice.reducer
export const { setLoggedInAC, setInitializedAC } = slice.actions


// TC
export const loginTC = (formData : LoginFormType) : AppThunkType => dispatch => {
    dispatch(setAppStatusAC({status : "loading"}))
    APIAuth.login(formData)
        .then(res=> {
            if(res.data.resultCode === 0){
                dispatch(setLoggedInAC({value :true}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data,dispatch)
            }
        })
        .catch(e => {
            handleServerNetWorkError(e.message, dispatch)
        })
}
export const initializedTC = () : AppThunkType => dispatch => {
    dispatch(setAppStatusAC({status: "loading"}))
    APIAuth.me()
        .then(res=> {
            if(res.data.resultCode === 0){
                dispatch(setLoggedInAC({value :true}))
                dispatch(setAppStatusAC({ status:"succeeded"}))
            } else {
                handleServerAppError(res.data,dispatch)
            }
        })
        .catch(e => {
            handleServerNetWorkError(e.message, dispatch)
        })
        .finally(()=> {
            dispatch(setInitializedAC())
        })
}

export const logOutTC = () : AppThunkType => dispatch => {
    dispatch(setAppStatusAC({status : "loading" }))
    APIAuth.logOut()
        .then(res=> {
            if(res.data.resultCode === 0){
                dispatch(setLoggedInAC({value :false}))
                dispatch(setAppStatusAC({status : "succeeded"}))
                dispatch(clearTodosDataAC())
            } else {
                handleServerAppError(res.data,dispatch)
            }
        })
        .catch(e => {
            handleServerNetWorkError(e.message, dispatch)
        })

}






// TYPES
