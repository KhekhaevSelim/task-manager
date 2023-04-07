import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import SuperButton from "./SuperButton";
import Task from "./Task";
import {TaskStatuses, TaskType} from "./API/API";
import {FilterValuesType} from './state/todolists-reducer';
import {useAppDispatch} from "./castomHooks/appHooks";
import {setTasksTC} from "./state/tasks-reducer";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, status : TaskStatuses, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Todolist = React.memo((props: PropsType) => {
      const dispatch = useAppDispatch()
    useEffect(()=> {
        dispatch(setTasksTC(props.id))
    },[])

    const addTask = useCallback ((title: string) => {
        props.addTask(title, props.id);
    },[props.addTask,props.id])

    const removeTodolist = useCallback(() => {
        props.removeTodolist(props.id);
    },[props.removeTodolist,props.id])
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title);
    },[props.changeTodolistTitle])

    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id),[props.changeFilter,props.id]);
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id),[props.changeFilter,props.id]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id),[props.changeFilter,props.id]);

    let tasksForRender = props.tasks;
    let allTasks = tasksForRender
    if (props.filter === "completed") {
        allTasks = tasksForRender.filter(t => t.status === TaskStatuses.Completed);
    }
    if(props.filter === "active"){
        allTasks = tasksForRender.filter(t => t.status === TaskStatuses.New);
    }
    return <div>
        <h3> <EditableSpan value={props.title} onChange={changeTodolistTitle} />
            <IconButton onClick={removeTodolist}>
                <Delete />
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
               allTasks.map(t => <Task key={t.id} todolistId={props.id} task={t} changeTaskTitle={props.changeTaskTitle}
                             changeTaskStatus={props.changeTaskStatus} removeTask={props.removeTask}/>)

            }
        </div>
        <div style={{ paddingTop: "10px"}}>
            <SuperButton filter={props.filter} callBack={onAllClickHandler} color={'inherit'} name={"all"}/>
            <SuperButton filter={props.filter} callBack={onActiveClickHandler} color={'primary'} name={"active"}/>
            <SuperButton filter={props.filter} callBack={onCompletedClickHandler} color={'secondary'} name={"completed"}/>
        </div>
    </div>
})


