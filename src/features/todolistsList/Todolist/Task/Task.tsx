import React, {ChangeEvent} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "../../../../components/EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses} from "../../../../DAL/API";
import {TaskBusinessType} from "./tasks-reducer";


type TaskPropsType = {
    removeTask : (taskId : string, todolistId : string) => void
    changeTaskStatus: (id: string, status : TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    task : TaskBusinessType
    todolistId : string
}

const Task = React.memo((props: TaskPropsType) => {
    const onClickHandler = () => props.removeTask(props.task.id, props.todolistId)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        props.changeTaskStatus(props.task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, props.todolistId);
    }
    const onTitleChangeHandler = (newValue: string) => {
        props.changeTaskTitle(props.task.id, newValue, props.todolistId);
    }

    return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeHandler}
            disabled={props.task.entityStatus === "loading"}
        />

        <EditableSpan value={props.task.title} disabled={props.task.entityStatus === "loading"} onChange={(newValue)=>onTitleChangeHandler(newValue)} />
        <IconButton onClick={onClickHandler} disabled={props.task.entityStatus === "loading"}>
            <Delete />
        </IconButton>
    </div>

});

export default Task;
