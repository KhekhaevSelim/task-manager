import {Dispatch} from "redux";
import {ResponseTasksType, ResponseTodolistType} from "../DAL/API"
import {setAppStatusAC, setErrorAC} from "../app/app-reducer";
export const handleServerAppError = <T>(data : ResponseTasksType<T> | ResponseTodolistType, dispatch : Dispatch) => {
    if(data.messages.length){
        dispatch(setErrorAC(data.messages[0]))
    } else {
        dispatch(setErrorAC("что-то пошло не так"))
    }
    dispatch(setAppStatusAC("failed"))
}
export const handleServerNetWorkError =(error : { message : string }, dispatch : Dispatch) => {
    dispatch(setErrorAC(error.message ? error.message : "some error"))
    dispatch(setAppStatusAC("failed"))
}


