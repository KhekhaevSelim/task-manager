import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import React, {useCallback, useEffect} from "react";
import {useAppDispatch} from "../../castomHooks/appHooks";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import { TasksBusinessType, tasksThunk} from "./Todolist/Task/tasks-reducer";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    FilterValuesType,
    getTodolistsTC,
    removeTodolistTC,
    TodolistBusinessType
} from "./Todolist/todolist-reducer";
import {TaskStatuses} from "../../DAL/API";
import {Navigate} from "react-router-dom";

type TodolistsListPropsType = {
    demo? : boolean
}
export const TodolistsList = ({demo = false, ...props}: TodolistsListPropsType) => {
    const dispatch = useAppDispatch();
    const tasks = useSelector<AppRootStateType, TasksBusinessType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.login.isLoggedIn)



    useEffect(() => {
        if(demo && isLoggedIn){
            dispatch(getTodolistsTC())
        }

    }, [demo,isLoggedIn])

    const todolists = useSelector<AppRootStateType, Array<TodolistBusinessType>>(state => state.todolists)


    const removeTask = useCallback((id: string, todolistId: string) => {
        dispatch(tasksThunk.removeTask({todolistId,taskId : id}))
    }, [])

    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(tasksThunk.createTask({ todolistId,title}));
    }, [dispatch])

    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
        dispatch(tasksThunk.updateTask( {taskId : id, todolistId , BusinessModel : { status }}))
    }, [])

    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
        dispatch(tasksThunk.updateTask( {taskId : id, todolistId , BusinessModel : { title : newTitle }}))
    }, [])

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        const action = changeTodolistFilterAC({ id : todolistId,filter : value } );
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

    if(!isLoggedIn){
        return <Navigate to={"/auth"}/>
    }
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
                                    todolist={tl}
                                    tasks={tasks[tl.id]}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                    demo={demo}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </>
    )
}
