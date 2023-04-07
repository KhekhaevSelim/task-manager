import {v1} from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType, setTodolistsAC} from './todolists-reducer';
import {APItodolist, TaskPriorities, TaskStatuses, TaskType} from "../API/API";
import {Dispatch} from "redux";
import {AppActionsType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    task : TaskType
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status : TaskStatuses
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

export type TasksActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
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
            return {...state, [action.todolistId] : action.tasks}
        }
        case "SET-TODOLISTS": {
          const stateCopy = {...state}
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case 'REMOVE-TASK': {
           return {...state, [action.todolistId] : state[action.todolistId].filter(t=> t.id !== action.taskId)}
            // const stateCopy = {...state}
            // const tasks = stateCopy[action.todolistId];
            // const newTasks = tasks.filter(t => t.id != action.taskId);
            // stateCopy[action.todolistId] = newTasks;
            // return stateCopy;
        }
        case 'ADD-TASK': {
            return {...state, [action.task.todoListId] : [action.task,...state[action.task.todoListId]]}
        }
        case 'CHANGE-TASK-STATUS': {
          return {...state, [action.todolistId] : state[action.todolistId].map(el=> el.id === action.taskId
              ?
                  {...el,status : action.status}
              :
              el)}
        }
        case 'CHANGE-TASK-TITLE':{
           return  {...state, [action.todolistId] : state[action.todolistId].map(el=> el.id === action.taskId
            ?
                    {...el, title : action.title}
                :
                el)}
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistId]: []
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
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}as const
}
export const addTaskAC = (task : TaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', task}
}
export const changeTaskStatusAC = (taskId: string, status : TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}
export const setTasksAC = (tasks : TaskType[], todolistId : string) => {
    return {
        type : "SET-TASKS",
        tasks,
        todolistId
    }as const
}

export const setTasksTC = (todolistId : string) => (dispatch : Dispatch<AppActionsType>) => {
    APItodolist.getTask(todolistId).then(res=> {
        dispatch(setTasksAC(res.data.items,todolistId))
    })
}

export const removeTaskTC = (todolistId : string, taskId : string) => (dispatch : Dispatch<AppActionsType>) => {
    APItodolist.deleteTask(todolistId,taskId)
        .then(()=> {
            dispatch(removeTaskAC(taskId,todolistId))
        })
}

export const createTaskTC = (todolistId : string, title : string) => (dispatch: Dispatch<AppActionsType>) => {
    APItodolist.createTask(todolistId,title)
        .then(res=> {
            dispatch(addTaskAC(res.data.data.item))
        })
}
