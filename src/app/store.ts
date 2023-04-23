import {TasksActionType, tasksReducer} from '../features/todolistsList/Todolist/Task/tasks-reducer';
import {TodolistsActionsType, todolistReducer} from '../features/todolistsList/Todolist/todolist-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk, { ThunkAction } from "redux-thunk";
import {appReducer, AppReducerActionsType} from "./app-reducer";
import {LoginACTypes, authReducer} from "../features/auth/authReducer";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer,
    app : appReducer,
    login : authReducer
})
export const store = createStore(rootReducer,applyMiddleware(thunk));
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>

// @ts-ignore
window.store = store;
export type AppActionsType = TodolistsActionsType | TasksActionType | AppReducerActionsType | LoginACTypes
