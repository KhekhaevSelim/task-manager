import React, {useEffect, useState} from "react"
import {APItodolist} from "../API/API";

export default {
    title: "Todolist-API"
}

export const GetTodolists = () => {

    let [todolists, setTodolists] = useState<any>("")

    const getTodolists = () => {
        APItodolist.getTodolists().then((res) =>
            setTodolists(res.data))
    }

    return (
        <div>{JSON.stringify(todolists)}

        <button onClick={getTodolists}>get todolists</button>
        </div>
    )
}
export const CreateTodolist = () => {

    let [todolists, setTodolists] = useState<any>(null)
    let [title, setTitle] = useState<string>("")
  const createTodolist = ( title : string) => {
      APItodolist.createTodolist(title).then((res) => {
          setTodolists(res.data.data.item)
      })
  }

    return (
        <div>{JSON.stringify(todolists)}

        <div>
            <input value={todolists} onChange={(e)=> {
                setTitle(e.currentTarget.value)
            }}/>
            <button onClick={()=>createTodolist(title)}>post todolist</button>
        </div>
        </div>
    )
}
export const DeleteTodolist = () => {

    let [todolists, setTodolists] = useState<any>("")
    let [todolistId, setTodolistId] = useState<string>("")
   const deleteTodolist = ( todolistId : string) => {
       APItodolist.deleteTodolist(todolistId).then((res) => {
           setTodolists(res.data.resultCode)
       })
   }

    return (
        <div>{JSON.stringify(todolists)}

        <div>
            <input value={todolistId} onChange={(e)=> {
            setTodolistId(e.currentTarget.value)
            }
            }/>
            <button onClick={()=>deleteTodolist(todolistId)}>delete todolist</button>
        </div>
        </div>
    )
}
export const UpdateTodolist = () => {

    let [todolists, setTodolists] = useState<any>("")
    let [newTitle, setNewTitle] = useState<string>("")
    let [todolistId, setTodolistId] = useState<string>("")

    const updateTodolistTitle = (todolistId : string, newTitle : string ) => {
        APItodolist.updateTodolist(todolistId,newTitle).then((res) => {
            setTodolists(res.data.data)
        })
    }



    return (
        <div>{JSON.stringify(todolists)}
            <input placeholder={"enter todolistId"} value={todolistId} onChange={(e)=>setTodolistId(e.currentTarget.value)}/>
            <input placeholder={"enter new title"} value={newTitle} onChange={(e)=> setNewTitle(e.currentTarget.value)}/>
        <button onClick={()=>updateTodolistTitle(todolistId, newTitle)}>put todolist</button>

        </div>
    )
}