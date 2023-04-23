import {addTodolistAC, clearTodosDataAC, removeTodolistAC, setTodolistsAC} from '../todolist-reducer';
import {APItodolist, TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType} from "../../../../DAL/API";
import {Dispatch} from "redux";
import {AppActionsType, AppRootStateType, AppThunkType} from "../../../../app/store";
import {setErrorAC, setAppStatusAC, RequestStatusType} from "../../../../app/app-reducer";
import {handleServerAppError, handleServerNetWorkError} from "../../../../error-utils/error-utils";

const initialState: TasksBusinessType = {}

export const tasksReducer = (state: TasksBusinessType = initialState, action: TasksActionType): TasksBusinessType => {
    switch (action.type) {
        case "SET-TASKS": return {...state, [action.todolistId]: action.tasks.map(el => ({ ...el, entityStatus : "idle" }))}
        case "SET-TODOLISTS": const stateCopy = {...state};action.todolists.forEach(tl => {stateCopy[tl.id] = []});return stateCopy
        case 'REMOVE-TASK': return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':  return {...state, [action.task.todoListId]: [{...action.task, entityStatus : "idle"}, ...state[action.task.todoListId]]}
        case 'UPDATE-TASK': return {...state, [action.todolistId] : state[action.todolistId].map(t=> t.id === action.taskId ?{...t,...action.model}:t)}
        case 'ADD-TODOLIST': return {...state,[action.todolist.id]: []}
        case 'REMOVE-TODOLIST': const copyState = {...state};delete copyState[action.id];return copyState;
        case "SET-TASK-ENTITY-STATUS": return {...state, [action.todolistId] : state[action.todolistId]
                .map(el => el.id === action.taskId ? {...el, entityStatus : action.entityStatus} : el)}
        case "CLEAR-DATA":
            return {}
        default: return state;}}

// ACTION CREATORS
export const removeTaskAC = (taskId: string, todolistId: string)=> ({type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateTaskBusinessModelType, todolistId: string) =>
({type: 'UPDATE-TASK', model, todolistId, taskId}as const)
export const setTasksAC = (tasks: TaskType[], todolistId: string) => ({type: "SET-TASKS",tasks,todolistId} as const)
export const setTaskEntityStatusAC = (todolistId : string, taskId : string, entityStatus: RequestStatusType) => (
    {type: "SET-TASK-ENTITY-STATUS",todolistId, taskId,entityStatus} as const)



// THUNK CREATORS
export const setTasksTC = (todolistId: string) : AppThunkType => dispatch => {
    dispatch(setAppStatusAC("loading"))
    APItodolist.getTask(todolistId).
    then(res => {
        dispatch(setTasksAC(res.data.items, todolistId))
        dispatch(setAppStatusAC("succeeded"))
    })
        .catch(error => {
            handleServerNetWorkError(error.message,dispatch)
        })
}
export const removeTaskTC = (todolistId: string, taskId: string) : AppThunkType => dispatch => {
    dispatch(setTaskEntityStatusAC(todolistId,taskId, "loading"))
    APItodolist.deleteTask(todolistId, taskId)
        .then((res)=> {
            if(res.data.resultCode === 0){
                dispatch(removeTaskAC(taskId,todolistId))
                dispatch(setTaskEntityStatusAC(todolistId,taskId, "succeeded"))

            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(setTaskEntityStatusAC(todolistId,taskId, "failed"))

            }
        })
        .catch(error=> {
            handleServerNetWorkError(error.message,dispatch)
            dispatch(setTaskEntityStatusAC(todolistId,taskId, "failed"))

        })



}
export const createTaskTC = (todolistId: string, title: string) : AppThunkType => dispatch => {
    dispatch(setAppStatusAC("loading"))
    APItodolist.createTask(todolistId, title).
    then(res => {
        if(res.data.resultCode === 0 ){
            dispatch(addTaskAC(res.data.data.item))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    })
        .catch((error)=> {
          handleServerNetWorkError(error,dispatch)
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, BusinessModel: UpdateTaskBusinessModelType) : AppThunkType =>
    (dispatch, getState) => {const state = getState()
        const task = state.tasks[todolistId].find(t=> t.id === taskId)
        if(!task){console.warn("task not found in BLL, Selim"); return}
        const ApiModel: UpdateTaskModelType = {title : task.title, status : task.status, deadline : task.deadline,
            startDate : task.startDate, priority : task.priority, description : task.description,...BusinessModel}
        dispatch(setAppStatusAC("loading"))
        dispatch(setTaskEntityStatusAC(todolistId,taskId, "loading"))
        APItodolist.updateTask(todolistId,taskId, ApiModel).
        then(res=> {
            if(res.data.resultCode === 0){
            dispatch(updateTaskAC(taskId, BusinessModel, todolistId))
                dispatch(setAppStatusAC("succeeded"))
                dispatch(setTaskEntityStatusAC(todolistId,taskId, "succeeded"))

            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(setTaskEntityStatusAC(todolistId,taskId, "failed"))

            }
        }
        )
            .catch(error=> {
                handleServerNetWorkError(error, dispatch)
                dispatch(setTaskEntityStatusAC(todolistId,taskId, "failed"))

            })
}

// TYPES
export type TasksActionType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof setTaskEntityStatusAC>
    | ReturnType<typeof clearTodosDataAC>

export type TasksBusinessType = {[key: string]: Array<TaskBusinessType>}
export type TaskBusinessType = TaskType & { entityStatus : RequestStatusType}
type UpdateTaskBusinessModelType = {title?: string, description?: string, status?: TaskStatuses,
    priority?: TaskPriorities, startDate?: string, deadline?: string}