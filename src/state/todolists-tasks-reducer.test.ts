import {addTodolistAC, TodolistBusinessType, todolistsReducer} from './todolists-reducer';
import {TasksBusinessType, tasksReducer} from './tasks-reducer';

test('ids should be equals', () => {
    const startTasksState: TasksBusinessType = {};
    const startTodolistsState: Array<TodolistBusinessType> = [];

    const action = addTodolistAC("new todolist");

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todolistId);
    expect(idFromTodolists).toBe(action.todolistId);
});
