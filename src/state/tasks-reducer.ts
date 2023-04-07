import {AddTodolistActionType, RemoveTodolistActionType, setTodolistsAC} from './todolists-reducer';
import {APItodolist, TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType} from "../API/API";
import {Dispatch} from "redux";
import {AppActionsType, AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    task: TaskType
}

export type updateTaskAC = {
    type: 'UPDATE-TASK',
    todolistId: string
    taskId: string
    model : UpdateTaskBusinessModelType
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

export type TasksActionsType = RemoveTaskActionType | AddTaskActionType
    | updateTaskAC
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setTasksAC>

export type TasksBusinessType = {
    [key: string]: Array<TaskType>
}
const initialState: TasksBusinessType = {}

export const tasksReducer = (state: TasksBusinessType = initialState, action: TasksActionsType): TasksBusinessType => {
    switch (action.type) {
        case "SET-TASKS": {
            return {...state, [action.todolistId]: action.tasks}
        }
        case "SET-TODOLISTS": {
            const stateCopy = {...state}
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case 'REMOVE-TASK': {
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        }
        case 'ADD-TASK': {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }
        case 'UPDATE-TASK': {
            return {
                ...state, [action.todolistId] : state[action.todolistId].map(t=> t.id === action.taskId ?
                        {...t,...action.model}
                :
                        t
                )
            }
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state, [action.todolistId]: state[action.todolistId].map(el => el.id === action.taskId
                    ?
                    {...el, title: action.title}
                    :
                    el)
            }
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', task}
}
export const updateTaskAC = (taskId: string, model: UpdateTaskBusinessModelType, todolistId: string): updateTaskAC => {
    return {type: 'UPDATE-TASK', model, todolistId, taskId}
}
export const setTasksAC = (tasks: TaskType[], todolistId: string) => {
    return {
        type: "SET-TASKS",
        tasks,
        todolistId
    } as const
}

export const setTasksTC = (todolistId: string) => (dispatch: Dispatch<AppActionsType>) => {
    APItodolist.getTask(todolistId).then(res => {
        dispatch(setTasksAC(res.data.items, todolistId))
    })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<AppActionsType>) => {
    APItodolist.deleteTask(todolistId, taskId)
        .then(() => {
            dispatch(removeTaskAC(taskId, todolistId))
        })
}

export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<AppActionsType>) => {
    APItodolist.createTask(todolistId, title)
        .then(res => {
            dispatch(addTaskAC(res.data.data.item))
        })
}


 type UpdateTaskBusinessModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export const updateTaskTC = (todolistId: string, taskId: string, BusinessModel: UpdateTaskBusinessModelType) =>
    (dispatch: Dispatch<AppActionsType>, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t=> t.id === taskId)
        if(!task){
            console.warn("task not found in state, Selim")
            return
            }
        const ApiModel: UpdateTaskModelType = {
            title : task.title,
            status : task.status,
            deadline : task.deadline,
            startDate : task.startDate,
            priority : task.priority,
            description : task.description,
            ...BusinessModel
        }
        APItodolist.updateTask(todolistId,taskId, ApiModel)
            .then(res=> {
                dispatch(updateTaskAC(taskId, BusinessModel, todolistId))
            })
    }
