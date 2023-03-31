import React, {ChangeEvent} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "./API/API";


type TaskPropsType = {
    removeTask : (taskId : string, todolistId : string) => void
    changeTaskStatus: (id: string, status : TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    task : TaskType
    todolistId : string
}

const Task = React.memo((props: TaskPropsType) => {
    console.log("Task")
    const onClickHandler = () => props.removeTask(props.task.id, props.todolistId)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        props.changeTaskStatus(props.task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, props.todolistId);
    }
    const onTitleChangeHandler = (newValue: string) => {
        debugger
        props.changeTaskTitle(props.task.id, newValue, props.todolistId);
    }


    return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeHandler}
        />

        <EditableSpan value={props.task.title} onChange={(newValue)=>onTitleChangeHandler(newValue)} />
        <IconButton onClick={onClickHandler}>
            <Delete />
        </IconButton>
    </div>

});

export default Task;