import {APItodolist, TodolistType} from '../../../DAL/API';
import {AppThunkType} from "../../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../../app/app-reducer";
import {handleServerAppError, handleServerNetWorkError} from "../../../utils/error-utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistBusinessType> = []

const slice = createSlice({
    name : "todolist",
    initialState : initialState,
    reducers : {
        removeTodolistAC(state, action : PayloadAction<{ todolistId : string}>){
        const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if(index > -1){
                state.splice(index,1)
            }
        },
        addTodolistAC (state, action : PayloadAction<{ todolist: TodolistType}>){
            state.unshift({...action.payload.todolist, filter : "all", entityStatus : "idle"})
        },
        changeTodolistTitleAC(state, action : PayloadAction<{id: string, title: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if(index > -1){
                state[index].title = action.payload.title
            }
        },
        changeTodolistFilterAC(state, action : PayloadAction<{id: string, filter: FilterValuesType}>){
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if(index > -1){
                state[index].filter = action.payload.filter
            }
        },
        setTodolistsAC (state, action : PayloadAction<{todolists: TodolistType[]}>){
           return  action.payload.todolists.map(el => ({...el, filter: "all", entityStatus: "idle"}))
        },
        setTodolistEntityStatusAC(state, action : PayloadAction<{todolistId: string, status: RequestStatusType}>){
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if(index > -1){
                state[index].entityStatus = action.payload.status
            }
        },
        clearTodosDataAC(state){
            state = []
        }
    }

})
export const todolistReducer = slice.reducer
export const { addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC,removeTodolistAC , setTodolistsAC,
setTodolistEntityStatusAC, clearTodosDataAC} = slice.actions

// THUNK CREATORS
export const getTodolistsTC = (): AppThunkType => dispatch => {
    dispatch(setAppStatusAC({ status : "loading"}))
    APItodolist.getTodolists()
        .then(res => {
            dispatch(setTodolistsAC({todolists : res.data }))
            dispatch(setAppStatusAC({ status : "succeeded"}))
        })
}
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunkType => dispatch => {
    APItodolist.updateTodolist(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC({ id : todolistId, title : title } ))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetWorkError(error.message, dispatch)
        })
}
export const removeTodolistTC = (todolistId: string): AppThunkType => dispatch => {
    dispatch(setAppStatusAC({ status : "loading"}))
    dispatch(setTodolistEntityStatusAC({ todolistId : todolistId, status :  "loading" } ))
    APItodolist.deleteTodolist(todolistId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC({ todolistId : todolistId } ))
                dispatch(setAppStatusAC({ status : "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch(error => {
        handleServerNetWorkError(error.message, dispatch)
    })
}
export const addTodolistTC = (title: string): AppThunkType => dispatch => {
    dispatch(setAppStatusAC({ status : "loading"}))
    APItodolist.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC({ todolist : res.data.data.item } ))
                dispatch(setAppStatusAC({ status : "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch(error => {
        handleServerNetWorkError(error.message, dispatch)
    })

}


// TYPES

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistBusinessType = TodolistType & { filter: FilterValuesType, entityStatus: RequestStatusType }
