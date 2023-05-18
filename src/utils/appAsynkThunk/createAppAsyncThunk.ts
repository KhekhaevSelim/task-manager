import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppRootStateType} from "../../app/store";
import {Dispatch} from "redux";
import {AppDispatchType} from "../../castomHooks/appHooks";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state : AppRootStateType,
    dispatch: AppDispatchType,
    rejectValue : null
}>()
