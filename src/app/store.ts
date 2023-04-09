import {TaskActionType, tasksReducer} from '../features/todolistsList/Todolist/Task/tasks-reducer';
import {TodolistsActionsType, todolistReducer} from '../features/todolistsList/Todolist/todolist-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from "redux-thunk";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer
})
export const store = createStore(rootReducer,applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
export type AppActionsType = TodolistsActionsType | TaskActionType
