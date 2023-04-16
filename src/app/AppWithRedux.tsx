import React from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {TodolistsList} from "../features/todolistsList/TodolistsList";
import LinearProgress from '@mui/material/LinearProgress';
import {ErrorSnackBar} from "../components/ErrorSnackBar";
import {useSelector} from "react-redux";
import {RequestStatusType} from "./app-reducer";
import {AppRootStateType} from "./store";

type AppPropsType = {
    demo? : boolean
}
function AppWithRedux({demo = false, ...props} : AppPropsType) {
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
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
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            {status === "loading" && <LinearProgress />}

            <ErrorSnackBar/>
            <Container fixed>
               <TodolistsList demo={true}/>
            </Container>
        </div>
    );
}
export default AppWithRedux;
