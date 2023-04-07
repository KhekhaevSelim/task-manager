import {addTodolistAC, TodolistBusinessType, todolistsReducer} from './todolists-reducer';
import {TasksBusinessType, tasksReducer} from './tasks-reducer';
import {v1} from "uuid";

test('ids should be equals', () => {
    const startTasksState: TasksBusinessType = {};
    const startTodolistsState: Array<TodolistBusinessType> = [];

    const action = addTodolistAC({id: v1(), title : "new todolist", addedDate : "", order : 0});

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todolist.id);
    expect(idFromTodolists).toBe(action.todolist.id);
});
