import React, {useEffect, useState} from "react"
import {APItodolist, postTodolistType, todolistItemType} from "../API/API";

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
export const PostTodolist = () => {

    let [todolists, setTodolists] = useState<any>(null)
    let [title, setTitle] = useState<string>("")
  const postTodolist = ( title : string) => {
      APItodolist.postTodolist(title).then((res) => {
          setTodolists(res.data.data.item)
      })
  }

    return (
        <div>{JSON.stringify(todolists)}

        <div>
            <input value={todolists} onChange={(e)=> {
                setTitle(e.currentTarget.value)
            }}/>
            <button onClick={()=>postTodolist(title)}>post todolist</button>
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
export const PutTodolist = () => {

    let [todolists, setTodolists] = useState<any>("")
    let [newTitle, setNewTitle] = useState<string>("")
    let [todolistId, setTodolistId] = useState<string>("")

    const changeTodolistTitle = (todolistId : string, newTitle : string ) => {
        APItodolist.putTodolist(todolistId,newTitle).then((res) => {
            setTodolists(res.data.data)
        })
    }



    return (
        <div>{JSON.stringify(todolists)}
            <input placeholder={"enter todolistId"} value={todolistId} onChange={(e)=>setTodolistId(e.currentTarget.value)}/>
            <input placeholder={"enter new title"} value={newTitle} onChange={(e)=> setNewTitle(e.currentTarget.value)}/>
        <button onClick={()=>changeTodolistTitle(todolistId, newTitle)}>put todolist</button>

        </div>
    )
}