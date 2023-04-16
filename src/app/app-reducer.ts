
const initialState : initialStateType = {
    status : "idle",
    error : null
}

export const appReducer = ( state : initialStateType = initialState, action : AppReducerActionsType) : initialStateType => {
    switch (action.type){
        case "SET-STATUS":
            return {...state, status : action.status}
        case "SET-ERROR":
            return {...state, error : action.error}
        default :
            return state
    }
}
// ACTION CREATORS
export const setErrorAC = ( error : null | string) => {
    return {
      type : "SET-ERROR",
      error
    }as const
}
export const setAppStatusAC = (status : RequestStatusType) => {
    return {
        type : "SET-STATUS",
        status
    }as const
}
// TYPES
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type initialStateType = {
    status : RequestStatusType,
    error : string | null
}
export type AppReducerActionsType =
    ReturnType<typeof setErrorAC>
    | ReturnType<typeof setAppStatusAC>