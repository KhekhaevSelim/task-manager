import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    FilterValuesType,
    removeTodolistAC, setTodolistEntityStatusAC, TodolistBusinessType,
    todolistReducer
} from './todolist-reducer';
import {v1} from 'uuid';
import {RequestStatusType} from "../../../app/app-reducer";


let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistBusinessType> = [];

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();
    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", entityStatus : "idle", addedDate : "", order : 0},
        {id: todolistId2, title: "What to buy", filter: "all" , entityStatus : "idle", addedDate : "", order : 0}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistReducer(startState, removeTodolistAC({ todolistId : todolistId1 } ))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    let newTodolistTitle = "New Todolist";

    const endState = todolistReducer(startState, addTodolistAC({ todolist : {id: v1(), title : newTodolistTitle, addedDate : "", order : 0} } ))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
    expect(endState[0].filter).toBe("all");
});

test('correct todolist should change its name', () => {
    let newTodolistTitle = "New Todolist";

    const action = changeTodolistTitleAC({ id : todolistId2, title : newTodolistTitle } ) ;

    const endState = todolistReducer(startState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
    let newFilter: FilterValuesType = "completed";

    const action = changeTodolistFilterAC( { id : todolistId2,filter : newFilter } );

    const endState = todolistReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

test("correct todolist entity status should be changed", ()=> {
    let newStatus: RequestStatusType = "loading";

    const action = setTodolistEntityStatusAC( { todolistId : todolistId2, status : newStatus } );

    const endState = todolistReducer(startState, action);

    expect(endState[0].entityStatus).toBe("idle");
    expect(endState[1].entityStatus).toBe(newStatus);
})