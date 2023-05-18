import {
    APItodolist,
    ChangeTodolistTitleArgType,
    getTodolistsArgType,
    RemoveTodolistArgType,
    ResultCode,
    TodolistType
} from '../../../DAL/API';
import {AppThunkType} from "../../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../../app/app-reducer";
import {handleServerAppError, handleServerNetWorkError} from "../../../utils/error-utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "../../../utils/appAsynkThunk/createAppAsyncThunk";

const getTodolists = createAppAsyncThunk<getTodolistsArgType, void>
("todolist/getTodolists", async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatusAC({status: "loading"}))
        const res = await APItodolist.getTodolists()
        return {todolists: res.data}
    } catch (e) {
        handleServerNetWorkError(e, dispatch)
        return rejectWithValue(null)
    }
})
const removeTodolist = createAppAsyncThunk<RemoveTodolistArgType, RemoveTodolistArgType>
("todolist/removeTodolist", async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatusAC({status: "loading"}))
        dispatch(setTodolistEntityStatusAC({todolistId: arg.todolistId, status: "loading"}))
        const res = await APItodolist.deleteTodolist(arg.todolistId)
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({status: "succeeded"}))
            dispatch(setTodolistEntityStatusAC({todolistId: arg.todolistId, status: "succeeded"}))
            return {todolistId: arg.todolistId}
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(setTodolistEntityStatusAC({todolistId: arg.todolistId, status: "failed"}))
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetWorkError(e, dispatch)
        dispatch(setTodolistEntityStatusAC({todolistId: arg.todolistId, status: "failed"}))
        return rejectWithValue(null)
    }
})

const changeTodolistTitle = createAppAsyncThunk<ChangeTodolistTitleArgType, ChangeTodolistTitleArgType>
("todolist/changeTodolistTitle", async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatusAC({status: "loading"}))
        dispatch(setTodolistEntityStatusAC({todolistId: arg.todolistId, status: "loading"}))
        const res = await APItodolist.updateTodolist(arg.todolistId, arg.title)
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({status: "succeeded"}))
            dispatch(setTodolistEntityStatusAC({todolistId: arg.todolistId, status: "succeeded"}))
            return {todolistId: arg.todolistId, title: arg.title}
        } else {
            dispatch(setTodolistEntityStatusAC({todolistId: arg.todolistId, status: "failed"}))
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetWorkError(e, dispatch)
        dispatch(setTodolistEntityStatusAC({todolistId: arg.todolistId, status: "failed"}))
        return rejectWithValue(null)
    }
})

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>
("todolist/addTodolist", async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatusAC({status: "loading"}))
        const res = await APItodolist.createTodolist(arg.title)
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({status: "succeeded"}))
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetWorkError(e, dispatch)
        return rejectWithValue(null)
    }
})


const initialState: Array<TodolistBusinessType> = []

const slice = createSlice({
    name: "todolist",
    initialState: initialState,
    reducers: {
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state[index].filter = action.payload.filter
            }
        },
        setTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state[index].entityStatus = action.payload.status
            }
        },
        clearTodosDataAC(state) {
            state = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getTodolists.fulfilled, (state, action) => {
            return action.payload.todolists.map(el => ({...el, filter: "all", entityStatus: "idle"}))
        })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todolistId)
                if (index > -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todolistId)
                if (index > -1) {
                    state[index].title = action.payload.title
                }
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
            })

    }
})
export const todolistReducer = slice.reducer
export const {
    changeTodolistFilterAC,
    setTodolistEntityStatusAC, clearTodosDataAC
} = slice.actions
export const todolistThunks = {getTodolists, removeTodolist, changeTodolistTitle, addTodolist}

// TYPES

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistBusinessType = TodolistType & { filter: FilterValuesType, entityStatus: RequestStatusType }
