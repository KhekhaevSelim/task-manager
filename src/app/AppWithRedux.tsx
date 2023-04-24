import React, {useEffect} from 'react';
import './App.css';
import {AppBar, Button, CircularProgress, Container, IconButton, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {TodolistsList} from "../features/todolistsList/TodolistsList";
import LinearProgress from '@mui/material/LinearProgress';
import {ErrorSnackBar} from "../components/ErrorSnackBar";
import {useSelector} from "react-redux";
import {RequestStatusType} from "./app-reducer";
import {AppRootStateType} from "./store";
import {Login} from "../features/auth/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {useAppDispatch} from "../castomHooks/appHooks";
import {initializedTC, logOutTC} from "../features/auth/authReducer";

type AppPropsType = {
    demo? : boolean
}
export function AppWithRedux({demo = false, ...props} : AppPropsType) {
    const dispatch = useAppDispatch()
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const initialized = useSelector<AppRootStateType, boolean>(state => state.login.isInitialized)
    const isLogged = useSelector<AppRootStateType, boolean>(state => state.login.isLoggedIn)
    useEffect(()=> {
        dispatch(initializedTC())
    },[])
    const logOut = () => {
        dispatch(logOutTC())
    }

    if(!initialized){
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    { isLogged && <Button color="inherit" onClick={logOut}>Log out</Button>}
                </Toolbar>
            </AppBar>
            {status === "loading" && <LinearProgress />}

            <ErrorSnackBar/>
            <Container fixed>
                <Routes>
                    <Route path={"/"} element={<TodolistsList demo={true}/>}/>
                    <Route path={"/auth"} element={<Login/>}/>
                    <Route path={"404"} element={<h1 style={{textAlign : "center"}}>error 404 page not found</h1>}/>
                    <Route path={"https://khekhaevselim.github.io/task-manager/"} element={<Navigate to={"/"}/>}/>
                    <Route path={"*"} element={<Navigate to={"404"}/>}/>
                </Routes>
            </Container>
        </div>
    );
}
