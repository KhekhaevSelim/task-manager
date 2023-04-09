import {addTodolistAC, removeTodolistAC, setTodolistsAC} from '../todolist-reducer';
import {APItodolist, TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType} from "../../../../DAL/API";
import {Dispatch} from "redux";
import {AppActionsType, AppRootStateType} from "../../../../app/store";

const initialState: TasksBusinessType = {}

export const tasksReducer = (state: TasksBusinessType = initialState, action: TaskActionType): TasksBusinessType => {
    switch (action.type) {
        case "SET-TASKS": return {...state, [action.todolistId]: action.tasks}
        case "SET-TODOLISTS": const stateCopy = {...state};action.todolists.forEach(tl => {stateCopy[tl.id] = []});return stateCopy
        case 'REMOVE-TASK': return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':  return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'UPDATE-TASK': return {...state, [action.todolistId] : state[action.todolistId].map(t=> t.id === action.taskId ?{...t,...action.model}:t)}
        case 'ADD-TODOLIST': return {...state,[action.todolist.id]: []}
        case 'REMOVE-TODOLIST': const copyState = {...state};delete copyState[action.id];return copyState;
        default: return state;}}

// ACTION CREATORS
export const removeTaskAC = (taskId: string, todolistId: string)=> ({type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateTaskBusinessModelType, todolistId: string) =>
({type: 'UPDATE-TASK', model, todolistId, taskId}as const)
export const setTasksAC = (tasks: TaskType[], todolistId: string) => ({type: "SET-TASKS",tasks,todolistId} as const)


// THUNK CREATORS
export const setTasksTC = (todolistId: string) => (dispatch: Dispatch<AppActionsType>) => {
    APItodolist.getTask(todolistId).then(res => {dispatch(setTasksAC(res.data.items, todolistId))})}
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<AppActionsType>) => {
    APItodolist.deleteTask(todolistId, taskId).then(() => {dispatch(removeTaskAC(taskId, todolistId))})}
export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<AppActionsType>) => {
    APItodolist.createTask(todolistId, title).then(res => {dispatch(addTaskAC(res.data.data.item))})}
export const updateTaskTC = (todolistId: string, taskId: string, BusinessModel: UpdateTaskBusinessModelType) =>
    (dispatch: Dispatch<AppActionsType>, getState: () => AppRootStateType) => {const state = getState()
        const task = state.tasks[todolistId].find(t=> t.id === taskId)
        if(!task){console.warn("task not found in BLL, Selim")
            return}
        const ApiModel: UpdateTaskModelType = {title : task.title, status : task.status, deadline : task.deadline,
            startDate : task.startDate, priority : task.priority, description : task.description,...BusinessModel}
        APItodolist.updateTask(todolistId,taskId, ApiModel).then(res=> {dispatch(updateTaskAC(taskId, BusinessModel, todolistId))})}

// TYPES
export type TaskActionType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setTasksAC>
export type TasksBusinessType = {[key: string]: Array<TaskType>}
type UpdateTaskBusinessModelType = {title?: string, description?: string, status?: TaskStatuses,
    priority?: TaskPriorities, startDate?: string, deadline?: string}