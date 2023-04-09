import {Dispatch} from 'redux';
import {v1} from 'uuid';
import {APItodolist, TodolistType} from '../../../DAL/API';
import {AppActionsType} from "../../../app/store";

const initialState: Array<TodolistBusinessType> = []

export const todolistReducer = (state: Array<TodolistBusinessType> = initialState, action: TodolistsActionsType): Array<TodolistBusinessType> => {
    switch (action.type) {
        case "SET-TODOLISTS" : return action.todolists.map(el => ({...el,filter: "all"}))
        case 'REMOVE-TODOLIST': return state.filter(tl => tl.id != action.id)
        case 'ADD-TODOLIST': return [{...action.todolist, filter : "all"}, ...state]
        case 'CHANGE-TODOLIST-TITLE': return state.map(tl=> tl.id === action.id ? {...tl, title : action.title}: tl)
        case 'CHANGE-TODOLIST-FILTER': return state.map(tl=> tl.id === action.id ? {...tl, filter : action.filter}: tl)
        default: return state;}}

// ACTION CREATORS
export const removeTodolistAC = (todolistId: string)=> ({type: 'REMOVE-TODOLIST', id: todolistId} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) =>({type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter} as const)
export const setTodolistsAC = (todolists: TodolistType[]) => ({type: "SET-TODOLISTS",todolists} as const)

// THUNK CREATORS
export const getTodolistsTC = () => (dispatch: Dispatch<AppActionsType>) => {APItodolist.getTodolists()
    .then(res => {dispatch(setTodolistsAC(res.data))})}
export const changeTodolistTitleTC = (todolistId: string, title: string) =>(dispatch: Dispatch<TodolistsActionsType>) =>
{APItodolist.updateTodolist(todolistId, title)
    .then(res => {dispatch(changeTodolistTitleAC(todolistId, title))})}
export const removeTodolistTC = (todolistId: string) =>(dispatch: Dispatch<TodolistsActionsType>) => {APItodolist.deleteTodolist(todolistId)
    .then(res => {dispatch(removeTodolistAC(todolistId))})}
export const addTodolistTC = (title: string) =>(dispatch: Dispatch<TodolistsActionsType>) => {APItodolist.createTodolist(title)
    .then(res => {dispatch(addTodolistAC(res.data.data.item))})}

// TYPES
export type TodolistsActionsType =
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof setTodolistsAC>
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistBusinessType = TodolistType & {filter: FilterValuesType}