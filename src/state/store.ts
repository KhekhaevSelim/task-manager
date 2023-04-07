import {TasksActionsType, tasksReducer} from './tasks-reducer';
import {TodolistsActionsType, todolistsReducer} from './todolists-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from "redux-thunk";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})
export const store = createStore(rootReducer,applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
export type AppActionsType = TodolistsActionsType | TasksActionsType
