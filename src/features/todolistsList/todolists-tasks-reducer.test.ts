import {TodolistBusinessType, todolistReducer, todolistThunks} from './Todolist/todolist-reducer';
import {TasksBusinessType, tasksReducer} from './Todolist/Task/tasks-reducer';
import {v1} from "uuid";

test('ids should be equals', () => {
    const startTasksState: TasksBusinessType = {};
    const startTodolistsState: Array<TodolistBusinessType> = [];

    const action = todolistThunks.addTodolist.fulfilled ({ todolist : {id: v1(), title : "new todolist", addedDate : "", order : 0}},
        "", {title : "new todolist"});

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
