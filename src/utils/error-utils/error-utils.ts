import {Dispatch} from "redux";
import {ResponseTasksType, ResponseTodolistType} from "../../DAL/API"
import {setAppStatusAC, setErrorAC} from "../../app/app-reducer";
import axios, {AxiosError} from "axios";
export const handleServerAppError = <T>(data : ResponseTasksType<T> | ResponseTodolistType, dispatch : Dispatch) => {
    if(data.messages.length){
        dispatch(setErrorAC({ error : data.messages[0]}))
    } else {
        dispatch(setErrorAC({ error : "что-то пошло не так"}))
    }
    dispatch(setAppStatusAC({ status : "failed"} ))
}
export const handleServerNetWorkError =(e : unknown, dispatch : Dispatch) => {
    const err = e as Error | AxiosError<{error : string}>
    if(axios.isAxiosError(err)) {
        const error = err.message ? err.message : "some error occurred"
        dispatch(setErrorAC({error}))
    } else {
        dispatch(setErrorAC({error : `some native error ${err.message}`}))
    }
    dispatch(setAppStatusAC({ status : "failed" } ))
}


