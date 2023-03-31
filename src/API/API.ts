import axios from "axios";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "073b7768-1047-4300-9261-15aa59d3ed4d"
    }
})

export type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

export type ResponseTodolistType<T = {}> = {
    data: T
    messages: string[]
    fieldsErrors: string[]
    resultCode: number
}


export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
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
        return instance.get<Array<TodolistType>>("todo-lists")
    },
    createTodolist(title : string) {
        return instance.post<ResponseTodolistType<{ item : TodolistType}>>("todo-lists", {title: title})
    },
    deleteTodolist(todolistId : string) {
        return instance.delete<ResponseTodolistType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId : string, newTitle: string) {
        return instance.put<ResponseTodolistType>(`todo-lists/${todolistId}`, {title: newTitle})
    },
    getTask(todolistId : string) {
        return instance.get<getTasksType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId : string, title : string) {
        return instance.post<responseTasksType>(`todo-lists/${todolistId}/tasks`, {title})
    },
    updateTask(todolistId : string, taskId : string, title : string){
        return instance.put<responseTasksType>(`todo-lists/${todolistId}/tasks/${taskId}`, {title})
    },
    deleteTask(todolistId : string, taskId : string){
        return instance.delete<responseTasksType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    }
}
