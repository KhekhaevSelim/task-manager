import React, {useState} from 'react';
import '../app/App.css';
import { Todolist} from '../features/todolistsList/Todolist/Todolist';
import {v1} from 'uuid';
import {AddItemForm} from '../components/AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {TaskPriorities, TaskStatuses, TaskType} from "../DAL/API";
import {FilterValuesType, TodolistBusinessType} from "../features/todolistsList/Todolist/todolist-reducer";
import {TaskBusinessType, TasksBusinessType} from "../features/todolistsList/Todolist/Task/tasks-reducer";







function App() {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let [todolists, setTodolists] = useState<Array<TodolistBusinessType>>([
        {id: todolistId1, title: "What to learn", filter: "all", entityStatus : "idle", addedDate : "", order : 0},
        {id: todolistId2, title: "What to buy", filter: "all" , entityStatus : "idle", addedDate : "", order : 0}
    ])

    let [tasks, setTasks] = useState<TasksBusinessType>({
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : todolistId1,
                order : 0, addedDate : "", entityStatus : "idle" },
            {id: v1(), title: "JS", status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : todolistId1,
                order : 0, addedDate : "" , entityStatus : "idle"}
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk",status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : todolistId2,
                order : 0, addedDate : "" , entityStatus : "idle"},
            {id: v1(), title: "React Book", status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : todolistId2,
                order : 0, addedDate : "", entityStatus : "idle"}
        ]
    });

    function removeTask(id: string, todolistId: string) {
        let todolistTasks = tasks[todolistId];
        tasks[todolistId] = todolistTasks.filter(t => t.id != id);
        setTasks({...tasks});
    }

    function addTask(title: string, todolistId: string) {
        let task : TaskBusinessType = {id: v1(), title: title, status: TaskStatuses.New, description: "",
            priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : todolistId,
            order : 0, addedDate : "" , entityStatus : "idle"};
        let todolistTasks = tasks[todolistId];
        tasks[todolistId] = [task, ...todolistTasks];
        setTasks({...tasks});
    }

    function changeStatus(id: string, status : TaskStatuses, todolistId: string) {
        let todolistTasks = tasks[todolistId];
        let task = todolistTasks.find(t => t.id === id);
        if (task) {
            task.status = status;
            setTasks({...tasks});
        }
    }

    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
        let todolistTasks = tasks[todolistId];
        let task = todolistTasks.find(t => t.id === id);
        if (task) {
            task.title = newTitle;
            setTasks({...tasks});
        }
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        let todolist = todolists.find(tl => tl.id === todolistId);
        if (todolist) {
            todolist.filter = value;
            setTodolists([...todolists])
        }
    }

    function removeTodolist(id: string) {
        setTodolists(todolists.filter(tl => tl.id != id));
        delete tasks[id];
        setTasks({...tasks});
    }

    function changeTodolistTitle(id: string, title: string) {
        const todolist = todolists.find(tl => tl.id === id);
        if (todolist) {
            todolist.title = title;
            setTodolists([...todolists]);
        }
    }

    function addTodolist(title: string) {
        let newTodolistId = v1();
        let newTodolist: TodolistBusinessType = {id: newTodolistId, title: title, filter: 'all', entityStatus : "idle", addedDate : "", order : 0};
        setTodolists([newTodolist, ...todolists]);
        setTasks({
            ...tasks,
            [newTodolistId]: []
        })
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu />
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodolist} />
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];
                            let tasksForTodolist = allTodolistTasks;

                            if (tl.filter === "active") {
                                tasksForTodolist = allTodolistTasks.filter(t => t.status === TaskStatuses.New);
                            }
                            if (tl.filter === "completed") {
                                tasksForTodolist = allTodolistTasks.filter(t => t.status === TaskStatuses.Completed);
                            }

                            return <Grid key={tl.id} item>
                                <Paper style={{padding: "10px"}}>
                                    <Todolist
                                        todolist={tl}
                                        key={tl.id}
                                        tasks={tasksForTodolist}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
