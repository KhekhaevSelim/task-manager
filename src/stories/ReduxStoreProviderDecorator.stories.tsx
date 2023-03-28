import {combineReducers, createStore} from "redux";
import {tasksReducer} from "../state/tasks-reducer";
import {todolistsReducer} from "../state/todolists-reducer";

import React from "react";

import {Provider} from "react-redux";
import {AppRootStateType, store} from "../state/store";
import { v1 } from "uuid";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {
    todolists: [
        {id: "todolistId1", title: "What to learn", filter: "all"},
        {id: "todolistId2", title: "What to buy", filter: "all"}
    ] ,
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true}
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "React Book", isDone: true}
        ]
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);
export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}
//
// const rootReducer = combineReducers({
//     task : tasksReducer,
//     todolist : todolistsReducer
// })
// const initialStateByStory = {
//     todolist : [
//         {id: "todolistId1", title : "What i need learn", filter : "all"},
//         {id: "todolistId2", title : "What i need buy", filter : "all"}
//     ],
//     tasks : {
//         ["todolistId1"] : [
//             {taskId : "1", title : "react", isDone : true},
//             {taskId : "2", title : "css", isDone : false},
//             {taskId : "3", title : "js", isDone : true}
//         ],
//         ["todolistId2"] : [
//             {taskId : "4", title : "bread", isDone : false},
//             {taskId : "5", title : "beef", isDone : true},
//             {taskId : "6", title : "milk", isDone : true}
//         ]
//     }
// }
//
// // @ts-ignore
// const StoryBookStore = createStore(rootReducer,initialStateByStory as AppRootStateType )
// export const ReduxStoreProviderDecorator = (story : any) => {
//     return <Provider store={StoryBookStore}> {story()}</Provider>
// }