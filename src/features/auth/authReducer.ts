import {LoginFormType} from "./Login";
import {AppThunkType} from "../../app/store";
import {APIAuth} from "../../DAL/API";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetWorkError} from "../../error-utils/error-utils";
import {clearTodosDataAC} from "../todolistsList/Todolist/todolist-reducer";

const initialState = {
    isLoggedIn : false,
    isInitialized : false
}


export const authReducer = (state : InitialStateType = initialState, action : LoginACTypes) : InitialStateType => {
    switch (action.type) {
        case "SET-LOGIN" :
            return {...state, isLoggedIn: action.value}
        case "SET-INITIALIZED":
            return {...state, isInitialized: true}
        default :
            return state
    }
}

// AC

export const setLoggenInAC = (value : boolean) => {
    return {
        type : "SET-LOGIN",
        value
    }as const
}
export const setInitializedAC = () => {
    return {
        type : "SET-INITIALIZED"
    }as const
}

// TC
export const loginTC = (formData : LoginFormType) : AppThunkType => dispatch => {
    dispatch(setAppStatusAC("loading"))
    APIAuth.login(formData)
        .then(res=> {
            if(res.data.resultCode === 0){
                dispatch(setLoggenInAC(true))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                handleServerAppError(res.data,dispatch)
            }
        })
        .catch(e => {
            handleServerNetWorkError(e.message, dispatch)
        })
}
export const initializedTC = () : AppThunkType => dispatch => {
    dispatch(setAppStatusAC("loading"))
    APIAuth.me()
        .then(res=> {
            if(res.data.resultCode === 0){
                dispatch(setLoggenInAC(true))
                dispatch(setAppStatusAC("succeeded"))
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
    dispatch(setAppStatusAC("loading"))
    APIAuth.logOut()
        .then(res=> {
            if(res.data.resultCode === 0){
                dispatch(setLoggenInAC(false))
                dispatch(setAppStatusAC("succeeded"))
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
type InitialStateType = typeof initialState
export type LoginACTypes = ReturnType<typeof setLoggenInAC> | ReturnType<typeof setInitializedAC>