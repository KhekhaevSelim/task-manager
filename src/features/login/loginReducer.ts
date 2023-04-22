import { ThunkDispatch } from "redux-thunk";
import {LoginFormType} from "./Login";
import {AppThunkType} from "../../app/store";
import {APIAuth} from "../../DAL/API";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetWorkError} from "../../error-utils/error-utils";

const initialState = {
    isLoggedIn : false
}


export const loginReducer = (state : InitialStateType = initialState, action : LoginACTypes) : InitialStateType => {
    switch (action.type) {
        case "SET-LOGIN" :
            return {...state, isLoggedIn: true}
        default :
            return state
    }
}

// AC

export const setLoginAC = () => {
    return {
        type : "SET-LOGIN"
    }as const
}

// TC
export const loginTC = (formData : LoginFormType) : AppThunkType => dispatch => {
    dispatch(setAppStatusAC("loading"))
    APIAuth.login(formData)
        .then(res=> {
            if(res.data.resultCode === 0){
                dispatch(setLoginAC())
                dispatch(setAppStatusAC("succeeded"))
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
export type LoginACTypes = ReturnType<typeof setLoginAC>