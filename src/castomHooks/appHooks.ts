import {ThunkDispatch} from "redux-thunk";
import {AppRootStateType} from "../state/store";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";

type AppDispatchType = ThunkDispatch<AppRootStateType, unknown, AnyAction>
export const useAppDispatch = () => useDispatch<AppDispatchType>()