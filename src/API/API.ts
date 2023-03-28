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
    }
}
