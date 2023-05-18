import {tasksReducer} from '../features/todolistsList/Todolist/Task/tasks-reducer';
import {todolistReducer} from '../features/todolistsList/Todolist/todolist-reducer';
import {AnyAction, combineReducers} from 'redux';
import thunk, {ThunkAction} from "redux-thunk";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/auth/authReducer";
import {configureStore} from "@reduxjs/toolkit";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer,
    app : appReducer,
    login : authReducer
})
export type RootReducerType = typeof rootReducer
export const store = configureStore({
    reducer : rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
})
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

// @ts-ignore
window.store = store;
// export type AppActionsType = ReturnType<typeof store.dispatch>
