import {appReducer, initialStateType, setErrorAC, setAppStatusAC} from "./app-reducer";

let startState : initialStateType;
beforeEach(()=>{
    startState = {
        error : null,
        status : "idle"
    }
})

test("correct error message should be set", ()=> {
    const endState = appReducer(startState, setErrorAC("some error"))
    expect(startState).not.toEqual(endState)
    expect(endState.error).toBe("some error")
})

test("correct status should be set", ()=> {
    const endState = appReducer(startState, setAppStatusAC("loading"))
    expect(startState).not.toBe(endState)
    expect(endState.status).toBe("loading")
})
