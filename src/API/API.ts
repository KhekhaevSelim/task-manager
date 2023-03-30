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

export type ResponseType<T = {}> = {
    data: T
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

export type responseTasksType = {
    resultCode: number
    messages: Array<string>
    data: {}
}
export const APItodolist = {
    getTodolists() {
        return instance.get<Array<getTodolistsType>>("todo-lists")
    },
    postTodolist(title : string) {
        return instance.post<ResponseType<{ item : getTodolistsType}>>("todo-lists", {title: title})
    },
    deleteTodolist(todolistId : string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    putTodolist(todolistId : string,newTitle: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title: newTitle})
    },
    getTasks(todolistId : string) {
        return instance.get<getTasksType>(`todo-lists/${todolistId}/tasks`)
    },
    postTasks(todolistId : string, title : string) {
        return instance.post<responseTasksType>(`todo-lists/${todolistId}/tasks`, {title})
    },
    putTasks(todolistId : string, taskId : string, title : string){
        return instance.put<responseTasksType>(`todo-lists/${todolistId}/tasks/${taskId}`, {title})
    },
    deleteTask(todolistId : string, taskId : string){
        return instance.delete<responseTasksType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    }
}
