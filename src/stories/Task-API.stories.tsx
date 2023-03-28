import {useState} from "react";
import React from "react"
import {APItodolist} from "../API/API";
export default {
    title : "Tasks-API"
}

export const GetTasks = () => {
    let [todolistId,setTodolistId] = useState<string>("")
    let [tasks, setTasks] = useState<any>(null)
    const getTasks = ( todolistId : string ) => {
        APItodolist.getTasks(todolistId).then((res)=> {
            debugger
            setTasks(res.data.items)
        })
    }

    return (
      <div>
          {JSON.stringify(tasks)}

          <div>
              <input value={todolistId} onChange={(e)=> setTodolistId(e.currentTarget.value)}/>
              <button onClick={()=>getTasks(todolistId)}>get tasks</button>
          </div>
      </div>
    )
}
export const PostTasks = () => {
    let [todolistId,setTodolistId] = useState<string>("")

    let [title,setTitle] = useState<string>("")

    let [tasks, setTasks] = useState<any>(null)
    const postTasks = ( todolistId : string , title : string) => {
        APItodolist.postTasks(todolistId, title).then((res)=> {
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
                <button onClick={()=>postTasks(todolistId,title)}>get tasks</button>
            </div>
        </div>
    )
}