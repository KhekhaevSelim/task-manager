import {Dispatch} from 'redux';
import {v1} from 'uuid';
import {APItodolist, TodolistType} from '../../../DAL/API';
import {AppActionsType, AppThunkType} from "../../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../../app/app-reducer";
import {handleServerAppError, handleServerNetWorkError} from "../../../error-utils/error-utils";

const initialState: Array<TodolistBusinessType> = []

export const todolistReducer = (state: Array<TodolistBusinessType> = initialState, action: TodolistsActionsType): Array<TodolistBusinessType> => {
    switch (action.type) {
        case "SET-TODOLISTS" : return action.todolists.map(el => ({...el,filter: "all", entityStatus : "idle"}))
        case 'REMOVE-TODOLIST': return state.filter(tl => tl.id != action.id)
        case 'ADD-TODOLIST': return [{...action.todolist, filter : "all", entityStatus : "idle"}, ...state]
        case 'CHANGE-TODOLIST-TITLE': return state.map(tl=> tl.id === action.id ? {...tl, title : action.title}: tl)
        case 'CHANGE-TODOLIST-FILTER': return state.map(tl=> tl.id === action.id ? {...tl, filter : action.filter}: tl)
        case "SET-TODOLIST-ENTITY-STATUS": return state.map(tl=> tl.id === action.todolistId ? {...tl, entityStatus : action.status}: tl)
        default: return state;}}


// ACTION CREATORS
export const removeTodolistAC = (todolistId: string)=> ({type: 'REMOVE-TODOLIST', id: todolistId} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) =>({type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter} as const)
export const setTodolistsAC = (todolists: TodolistType[]) => ({type: "SET-TODOLISTS",todolists} as const)
export const setTodolistEntityStatusAC = (todolistId : string, status : RequestStatusType) => ({type : "SET-TODOLIST-ENTITY-STATUS", status,todolistId}as const)

// THUNK CREATORS
export const getTodolistsTC = () : AppThunkType => dispatch=> {
    dispatch(setAppStatusAC("loading"))
    APItodolist.getTodolists()
    .then(res => {
        dispatch(setTodolistsAC(res.data))
        dispatch(setAppStatusAC("succeeded"))
    })
}
export const changeTodolistTitleTC = (todolistId: string, title: string)  : AppThunkType  => dispatch =>
{APItodolist.updateTodolist(todolistId, title)
    .then(res => {
        if(res.data.resultCode === 0){
            dispatch(changeTodolistTitleAC(todolistId, title))
        } else {
            handleServerAppError(res.data, dispatch)
        }
       })
    .catch(error => {
        handleServerNetWorkError(error.message, dispatch)
    })
}
export const removeTodolistTC = (todolistId: string)  : AppThunkType  =>dispatch => {
    dispatch(setAppStatusAC("loading"))
    dispatch(setTodolistEntityStatusAC(todolistId,"loading"))
    APItodolist.deleteTodolist(todolistId)
    .then(res => {
        if(res.data.resultCode === 0){
            dispatch(removeTodolistAC(todolistId))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError(res.data,dispatch)
        }}).catch(error => {
            handleServerNetWorkError(error.message, dispatch)
    })
}
export const addTodolistTC = (title: string)  : AppThunkType  => dispatch => {
    dispatch(setAppStatusAC("loading"))
    APItodolist.createTodolist(title)
    .then(res => {
        if(res.data.resultCode === 0){
            dispatch(addTodolistAC(res.data.data.item))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch(error => {
        handleServerNetWorkError(error.message, dispatch)
    })

}


// TYPES
export type TodolistsActionsType =
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setTodolistEntityStatusAC>
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistBusinessType = TodolistType & {filter: FilterValuesType, entityStatus : RequestStatusType}