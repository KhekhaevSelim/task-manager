import axios from "axios";
import {LoginFormType} from "../features/auth/Login";
import { UpdateTaskBusinessModelType } from "../features/todolistsList/Todolist/Task/tasks-reducer";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "073b7768-1047-4300-9261-15aa59d3ed4d"
    }
})

// API
export const APItodolist = {
    getTodolists() {
        return instance.get<Array<TodolistType>>("todo-lists")
    },
    createTodolist(title: string) {
        return instance.post<ResponseTodolistType<{ item: TodolistType }>>("todo-lists", {title: title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseTodolistType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, newTitle: string) {
        return instance.put<ResponseTodolistType>(`todo-lists/${todolistId}`, {title: newTitle})
    },
    getTask(todolistId: string) {
        return instance.get<getTasksType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(arg : CreateTaskArgType) {
        return instance.post<ResponseTasksType<{ item: TaskType }>>(`todo-lists/${arg.todolistId}/tasks`, {title :arg.title})
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseTasksType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseTasksType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`)
    }
}

export const APIAuth = {
    login(data: LoginFormType) {
        return instance.post<ResponseTasksType<{ userId: number }>>("auth/login", data)
    },
    me() {
        return instance.get<ResponseTasksType<{ id: string, email: string, login: string }>>("auth/me")
    },
    logOut() {
        return instance.delete<ResponseTasksType>("auth/login")
    }
}
// TYPES
export type TodolistType = { id: string, title: string, addedDate: string, order: number }
export type ResponseTodolistType<T = {}> = { data: T, messages: string[], fieldsErrors: string[], resultCode: number }

export enum TaskStatuses {New = 0, InProgress = 1, Completed = 2, Draft = 3}

export enum TaskPriorities {Low = 0, Middle = 1, Hi = 2, Urgently = 3, Later = 4}

export const ResultCode = {
    Success : 0,
    Error : 1,
    Captcha : 10
}as const

export type TaskType = {
    description: string, title: string, status: TaskStatuses, priority: TaskPriorities, startDate: string,
    deadline: string, id: string, todoListId: string, order: number, addedDate: string
}
export type getTasksType = { error: string, items: Array<TaskType>, totalCount: number }
export type ResponseTasksType<T = {}> = { resultCode: number, messages: Array<string>, data: T }
export type UpdateTaskModelType = {
    title: string, description: string, status: TaskStatuses, priority: TaskPriorities,
    startDate: string, deadline: string
}
export type CreateTaskArgType = {
    todolistId: string
    title: string
}
export type UpdateTaskArgType = { todolistId: string, taskId: string, BusinessModel: UpdateTaskBusinessModelType }
export type RemoveTaskArgType = {taskId: string, todolistId: string}
export type getTodolistsArgType = {
    todolists : TodolistType[]
}
export type RemoveTodolistArgType = {
    todolistId : string
}
export type ChangeTodolistTitleArgType = {
    todolistId : string,
    title : string
}
