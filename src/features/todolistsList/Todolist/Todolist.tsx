import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../components/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan';
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import SuperButton from "../../../components/SuperButton";
import Task from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../DAL/API";
import {FilterValuesType, TodolistBusinessType} from './todolist-reducer';
import {useAppDispatch} from "../../../castomHooks/appHooks";
import {TaskBusinessType, tasksThunk} from "./Task/tasks-reducer";


type PropsType = {
    todolist : TodolistBusinessType
    tasks: Array<TaskBusinessType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, status : TaskStatuses, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    demo? : boolean
}

export const Todolist = React.memo(({demo, ...props}: PropsType) => {
      const dispatch = useAppDispatch()
    useEffect(()=> {
        if(demo) {
            dispatch(tasksThunk.setTasks(props.todolist.id))
        }
    },[])

    const addTask = useCallback ((title: string) => {
        props.addTask(title, props.todolist.id);
    },[props.addTask,props.todolist.id])

    const removeTodolist = useCallback(() => {
        props.removeTodolist(props.todolist.id);
    },[props.removeTodolist,props.todolist.id])
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.todolist.id, title);
    },[props.changeTodolistTitle])

    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.todolist.id),[props.changeFilter,props.todolist.id]);
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.todolist.id),[props.changeFilter,props.todolist.id]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.todolist.id),[props.changeFilter,props.todolist.id]);

    let tasksForRender = props.tasks;
    let allTasks = tasksForRender
    if (props.todolist.filter === "completed") {
        allTasks = tasksForRender.filter(t => t.status === TaskStatuses.Completed);
    }
    if(props.todolist.filter === "active"){
        allTasks = tasksForRender.filter(t => t.status === TaskStatuses.New);
    }
    // console.log(props.todolist.entityStatus)
    return <div>
        <h3> <EditableSpan  value={props.todolist.title} onChange={changeTodolistTitle} />
            <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === "loading"}>
                <Delete />
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === "loading"}/>
        <div>
            {
               allTasks.map(t => <Task key={t.id} todolistId={props.todolist.id} task={t} changeTaskTitle={props.changeTaskTitle}
                             changeTaskStatus={props.changeTaskStatus} removeTask={props.removeTask}/>)

            }
        </div>
        <div style={{ paddingTop: "10px"}}>
            <SuperButton filter={props.todolist.filter} callBack={onAllClickHandler} color={'inherit'} name={"all"}/>
            <SuperButton filter={props.todolist.filter} callBack={onActiveClickHandler} color={'primary'} name={"active"}/>
            <SuperButton filter={props.todolist.filter} callBack={onCompletedClickHandler} color={'secondary'} name={"completed"}/>
        </div>
    </div>
})


