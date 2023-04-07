import {Dispatch} from 'redux';
import {v1} from 'uuid';
import {APItodolist, TodolistType} from '../API/API';
import {AppActionsType} from "./store";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
todolist : TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}

export type TodolistsActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | ReturnType<typeof setTodolistsAC>
export type FilterValuesType = "all" | "active" | "completed";

export type TodolistBusinessType = TodolistType & {
    filter: FilterValuesType
}
const initialState: Array<TodolistBusinessType> = []

export const todolistsReducer = (state: Array<TodolistBusinessType> = initialState, action: TodolistsActionsType): Array<TodolistBusinessType> => {
    switch (action.type) {
        case "SET-TODOLISTS" : {

            return action.todolists.map(el => ({
                ...el,
                filter: "all"
            }))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id != action.id)
        }
        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter : "all"}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.filter = action.filter;
            }
            return [...state]
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (todolist: TodolistType): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', todolist}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}

export const setTodolistsAC = (todolists: TodolistType[]) => {
    return {
        type: "SET-TODOLISTS",
        todolists
    } as const
}
export const getTodolistsTC = () => (dispatch: Dispatch<AppActionsType>) => {
    APItodolist.getTodolists().then(res => {
        dispatch(setTodolistsAC(res.data))
    })
}

export const changeTodolistTitleTC = (todolistId: string, title: string) =>
    (dispatch: Dispatch<AppActionsType>) => {
        APItodolist.updateTodolist(todolistId, title)
            .then(res => {
            })
        dispatch(changeTodolistTitleAC(todolistId, title))
    }

export const removeTodolistTC = (todolistId: string) =>
    (dispatch: Dispatch<AppActionsType>) => {
        APItodolist.deleteTodolist(todolistId)
            .then(res => {
            })
        dispatch(removeTodolistAC(todolistId))
    }
export const addTodolistTC = (title: string) =>
    (dispatch: Dispatch<AppActionsType>) => {
        APItodolist.createTodolist(title)
            .then(res => {
                dispatch(addTodolistAC(res.data.data.item))
            })

    }