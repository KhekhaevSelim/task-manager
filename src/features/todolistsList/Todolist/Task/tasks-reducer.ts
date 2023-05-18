import {addTodolistAC, clearTodosDataAC, removeTodolistAC, setTodolistsAC} from '../todolist-reducer';
import {
    APItodolist,
    CreateTaskArgType, RemoveTaskArgType,
    ResultCode,
    TaskPriorities,
    TaskStatuses,
    TaskType, UpdateTaskArgType,
    UpdateTaskModelType
} from "../../../../DAL/API";
import {AppThunkType} from "../../../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../../../app/app-reducer";
import {handleServerAppError, handleServerNetWorkError} from "../../../../utils/error-utils/error-utils";
import {createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "../../../../utils/appAsynkThunk/createAppAsyncThunk";

const initialState: TasksBusinessType = {}

const createTask = createAppAsyncThunk<{ task: TaskType }, CreateTaskArgType>
("tasks/createTask", async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatusAC({status: "loading"}))
        const res = await APItodolist.createTask(arg)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: "succeeded"}))
            return {task: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetWorkError(e,dispatch)
        return rejectWithValue(null)
    }
})
const setTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>
("tasks/setTasks", async (todolistId: string, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await APItodolist.getTask(todolistId)
        dispatch(setAppStatusAC({status: "succeeded"}))
        const tasks = res.data.items
        return {tasks, todolistId}
    } catch (e) {
        handleServerNetWorkError(e, dispatch)
        return rejectWithValue(null)
    }
})



const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>
("tasks/updateTask", async (arg,thunkApi)=> {
const { dispatch, getState,rejectWithValue } = thunkApi
    try{
        dispatch(setAppStatusAC({status: "loading"}))
        dispatch(setTaskEntityStatusAC({todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: "loading"}))
        const state = getState()
        const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
        if (!task) {
            console.warn("task not found in BLL, Selim");
            return rejectWithValue(null)
        }
        const ApiModel: UpdateTaskModelType = {
            title: task.title, status: task.status, deadline: task.deadline,
            startDate: task.startDate, priority: task.priority, description: task.description, ...arg.BusinessModel
        }
        const res = await APItodolist.updateTask(arg.todolistId, arg.taskId, ApiModel)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(setAppStatusAC({status: "succeeded"}))
                dispatch(setTaskEntityStatusAC({todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: "succeeded"}))
                 return arg
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(setTaskEntityStatusAC({todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: "failed"}))
                return rejectWithValue(null)
            }
        } catch (e){
        handleServerNetWorkError(e, dispatch)
        dispatch(setTaskEntityStatusAC({todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: "failed"}))
        return rejectWithValue(null)
    }
    })

const removeTask = createAppAsyncThunk<RemoveTaskArgType,RemoveTaskArgType>
("tasks/removeTask" , async (arg, thunkAPI)=> {
    const { dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatusAC({status: "loading"}))
        dispatch(setTaskEntityStatusAC({todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: "loading"}))
        const res = await APItodolist.deleteTask(arg.todolistId, arg.taskId)
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({status: "succeeded"}))
            dispatch(setTaskEntityStatusAC({todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: "succeeded"}))
            return arg
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(setTaskEntityStatusAC({todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: "failed"}))
            return rejectWithValue(null)
        }
    } catch (e){
        handleServerNetWorkError(e,dispatch)
        return rejectWithValue(null)
    }
})
const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        setTaskEntityStatusAC(state, action: PayloadAction<{ todolistId: string, taskId: string, entityStatus: RequestStatusType }>) {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            if(index > -1){
                state[action.payload.todolistId][index] = {...state[action.payload.todolistId][index], entityStatus : action.payload.entityStatus}
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setTasks.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks.map(el => ({...el, entityStatus: "idle"}))
        })
            .addCase(createTask.fulfilled, (state, action)=> {
                state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus : "idle"})
            })
            .addCase(removeTask.fulfilled, (state, action)=> {
                    const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
                    if (index > -1) {
                        state[action.payload.todolistId].splice(index, 1)
                    }
            })
            .addCase(updateTask.fulfilled, (state, action)=> {
                const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
                state[action.payload.todolistId][index] = {...state[action.payload.todolistId][index], ...action.payload.BusinessModel}
            })
            .addCase(setTodolistsAC, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            })
            .addCase(addTodolistAC, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolistAC, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(clearTodosDataAC, (state, action) => {
                state = {}
            })
    }
})

export const tasksReducer = slice.reducer
export const {setTaskEntityStatusAC} = slice.actions

export const tasksThunk = {setTasks, createTask, updateTask, removeTask}

export type TasksBusinessType = { [key: string]: Array<TaskBusinessType> }
export type TaskBusinessType = TaskType & { entityStatus: RequestStatusType }
export type UpdateTaskBusinessModelType = {
    title?: string, description?: string, status?: TaskStatuses,
    priority?: TaskPriorities, startDate?: string, deadline?: string
}
