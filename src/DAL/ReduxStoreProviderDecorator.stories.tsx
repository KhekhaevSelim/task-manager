import {applyMiddleware, combineReducers, createStore} from "redux";
import {tasksReducer} from "../features/todolistsList/Todolist/Task/tasks-reducer";
import {todolistReducer} from "../features/todolistsList/Todolist/todolist-reducer";

import React from "react";

import {Provider} from "react-redux";
import {AppRootStateType, store} from "../app/store";
import { v1 } from "uuid";
import {TaskPriorities, TaskStatuses} from "./API";
import thunk from "redux-thunk";
import {appReducer} from "../app/app-reducer";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer,
    app : appReducer
})

const initialGlobalState : AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn", filter: "all", entityStatus : "idle", addedDate : "", order : 0},
        {id: "todolistId2", title: "What to buy", filter: "all" , entityStatus : "idle", addedDate : "", order : 0}
    ] ,
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId1",
                order : 0, addedDate : "", entityStatus : "idle" },
            {id: v1(), title: "JS", status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId1",
                order : 0, addedDate : "", entityStatus : "idle" }
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk",status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId2",
                order : 0, addedDate : "" , entityStatus : "idle"},
            {id: v1(), title: "React Book", status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId2",
                order : 0, addedDate : "", entityStatus : "idle"}
        ]
    },
    app : {
        status : "idle",
        error : null
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState ,applyMiddleware(thunk));
export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}
