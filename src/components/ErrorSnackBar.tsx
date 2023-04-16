import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {useSelector} from "react-redux";
import { AppRootStateType } from '../app/store';
import {useAppDispatch} from "../castomHooks/appHooks";
import {setErrorAC} from "../app/app-reducer";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ErrorSnackBar() {
    const error = useSelector<AppRootStateType, string | null>(state => state.app.error)
    const dispatch = useAppDispatch()
    const isOpen = error !== null
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setErrorAC(null))
    };

    return (

            <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
                <Alert severity="error">{error}</Alert>
            </Snackbar>

    );
}