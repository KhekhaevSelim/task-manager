import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import React, {useCallback, useEffect} from "react";
import {useAppDispatch} from "../../castomHooks/appHooks";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {createTaskTC, removeTaskTC, TasksBusinessType, updateTaskTC} from "./Todolist/Task/tasks-reducer";
import {
    addTodolistTC,
    changeTodolistFilterAC, changeTodolistTitleTC,
    FilterValuesType,
    getTodolistsTC,
    removeTodolistTC,
    TodolistBusinessType
} from "./Todolist/todolist-reducer";
import {TaskStatuses} from "../../DAL/API";

export const TodolistsList = () => {
    const dispatch = useAppDispatch();
    const tasks = useSelector<AppRootStateType, TasksBusinessType>(state => state.tasks)


    useEffect(() => {
        dispatch(getTodolistsTC())
    }, [])

    const todolists = useSelector<AppRootStateType, Array<TodolistBusinessType>>(state => state.todolists)


    const removeTask = useCallback((id: string, todolistId: string) => {
        dispatch(removeTaskTC(todolistId,id))
    }, [])

    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(createTaskTC(todolistId,title));
    }, [dispatch])

    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskTC(todolistId,id, {status} ))
    }, [])

    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
        const action = updateTaskTC(todolistId,id, {title : newTitle});
        dispatch(action);
    }, [])

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, [])

    const removeTodolist = useCallback((id: string) => {
        dispatch(removeTodolistTC(id));
    }, [])

    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(changeTodolistTitleTC(id,title))
    }, [])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title));
    }, [])

    return (
        <>
            <Grid container style={{padding: "20px"}}>
                <AddItemForm addItem={addTodolist} />
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {

                        return <Grid item key={tl.id}>
                            <Paper style={{padding: "10px"}}>
                                <Todolist
                                    id={tl.id}
                                    title={tl.title}
                                    tasks={tasks[tl.id]}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    filter={tl.filter}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </>
    )
}