import {useState} from "react";
import React from "react"
import {APItodolist} from "../API/API";
export default {
    title : "Tasks-API"
}

export const GetTask = () => {
    let [todolistId,setTodolistId] = useState<string>("")
    let [tasks, setTasks] = useState<any>(null)
    const getTask = ( todolistId : string ) => {
        APItodolist.getTask(todolistId).then((res)=> {
            debugger
            setTasks(res.data.items)
        })
    }

    return (
      <div>
          {JSON.stringify(tasks)}

          <div>
              <input value={todolistId} onChange={(e)=> setTodolistId(e.currentTarget.value)} placeholder={"todolistId"}/>
              <button onClick={()=>getTask(todolistId)}>get tasks</button>
          </div>
      </div>
    )
}
export const CreateTasks = () => {
    let [todolistId,setTodolistId] = useState<string>("")

    let [title,setTitle] = useState<string>("")

    let [tasks, setTasks] = useState<any>(null)
    const updateTask = ( todolistId : string , title : string) => {
        APItodolist.createTask(todolistId, title).then((res)=> {
            debugger
            setTasks(res.data.data)
        })
    }

    return (
        <div>
            {JSON.stringify(tasks)}

            <div>
                <input placeholder={"todolistId"} value={todolistId} onChange={(e)=> setTodolistId(e.currentTarget.value)}/>
                <input placeholder={"taskTitle"} value={title} onChange={(e)=> setTitle(e.currentTarget.value)}/>
                <button onClick={()=>updateTask(todolistId,title)}>get tasks</button>
            </div>
        </div>
    )
}

export const UpdateTasks = () => {
    let [todolistId,setTodolistId] = useState<string>("")
    let [taskId, setTaskId] = useState<string>("")
    let [title,setTitle] = useState<string>("")

    let [tasks, setTasks] = useState<any>(null)
    const putTasks = ( todolistId : string ,taskId : string, title : string) => {
        APItodolist.updateTask(todolistId, taskId, title).then((res)=> {
            debugger
            setTasks(res.data.data)
        })
    }

    return (
        <div>
            {JSON.stringify(tasks)}

            <div>
                <input placeholder={"todolistId"} value={todolistId} onChange={(e)=> setTodolistId(e.currentTarget.value)}/>
                <input placeholder={"taskId"} value={taskId} onChange={(e)=> setTaskId(e.currentTarget.value)}/>
                <input placeholder={"taskTitle"} value={title} onChange={(e)=> setTitle(e.currentTarget.value)}/>
                <button onClick={()=>putTasks(todolistId, taskId, title)}>put tasks</button>
            </div>
        </div>
    )
}

export const DeleteTask = () => {
    let [todolistId,setTodolistId] = useState<string>("")
    let [taskId, setTaskId] = useState<string>("")

    let [tasks, setTasks] = useState<any>(null)
    const deleteTask = ( todolistId : string ,taskId : string) => {
        APItodolist.deleteTask(todolistId, taskId).then((res)=> {
            setTasks(res.data.data)
        })
    }

    return (
        <div>
            {JSON.stringify(tasks)}

            <div>
                <input placeholder={"todolistId"} value={todolistId} onChange={(e)=> setTodolistId(e.currentTarget.value)}/>
                <input placeholder={"taskId"} value={taskId} onChange={(e)=> setTaskId(e.currentTarget.value)}/>
                <button onClick={()=>deleteTask(todolistId, taskId)}>delete tasks</button>
            </div>
        </div>
    )
}