import React from "react"
import axios from "axios";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "073b7768-1047-4300-9261-15aa59d3ed4d"
    }
})

export type getTodolistsType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}
export type todolistItemType = {
    item: {
        "id": string,
        "title": string,
        "addedDate": string,
        "order": number
    }
}
export type deleteTodolistType = {
    resultCode: number
    messages: Array<string>
    data: {}
}
export type postTodolistType = {
    resultCode: number
    messages: Array<string>
    data: todolistItemType
}
export type putTodolistType = {
    data: {}
    messages: string[]
    fieldsErrors: string[]
    resultCode: number
}
export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type getTasksType = {
    error : string
    items : Array<TaskType>

    totalCount : number
}

export type postTasksType = {
    resultCode: number
    messages: Array<string>
    data: Array<TaskType>
}
export const APItodolist = {
    getTodolists() {
        return instance.get<Array<getTodolistsType>>("todo-lists")
    },
    postTodolist(title : string) {
        return instance.post<postTodolistType>("todo-lists", {title: title})
    },
    deleteTodolist(todolistId : string) {
        return instance.delete<deleteTodolistType>(`todo-lists/${todolistId}`)
    },
    putTodolist(todolistId : string,newTitle: string) {
        return instance.put<putTodolistType>(`todo-lists/${todolistId}`, {title: newTitle})
    },
    getTasks(todolistId : string) {
        return instance.get<getTasksType>(`todo-lists/${todolistId}/tasks`)
    },
    postTasks(todolistId : string, title : string) {
        return instance.post<postTasksType>(`todo-lists/${todolistId}/tasks`, {title : title})
    }
}
