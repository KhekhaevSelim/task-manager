import {combineReducers, createStore} from "redux";
import {tasksReducer} from "../features/todolistsList/Todolist/Task/tasks-reducer";
import {todolistReducer} from "../features/todolistsList/Todolist/todolist-reducer";

import React from "react";

import {Provider} from "react-redux";
import {AppRootStateType, store} from "../app/store";
import { v1 } from "uuid";
import {TaskPriorities, TaskStatuses} from "./API";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer
})

const initialGlobalState = {
    todolists: [
        {id: "todolistId1", title: "What to learn", filter: "all", addedDate : "", order : 0},
        {id: "todolistId2", title: "What to buy", filter: "all" , addedDate : "", order : 0}
    ] ,
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId1",
                order : 0, addedDate : "" },
            {id: v1(), title: "JS", status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId1",
                order : 0, addedDate : "" }
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk",status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId2",
                order : 0, addedDate : "" },
            {id: v1(), title: "React Book", status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId2",
                order : 0, addedDate : ""}
        ]
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);
export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}
