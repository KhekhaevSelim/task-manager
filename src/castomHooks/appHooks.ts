import {ThunkDispatch} from "redux-thunk";
import {AppRootStateType} from "../app/store";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";

export type AppDispatchType = ThunkDispatch<AppRootStateType, unknown, AnyAction>
export const useAppDispatch = () => useDispatch<AppDispatchType>()
