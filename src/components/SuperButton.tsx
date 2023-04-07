import React from 'react';
import {Button} from "@mui/material";
import { FilterValuesType } from '../state/todolists-reducer';

type SuperButtonPropsType = {
    filter : FilterValuesType
    callBack : () => void
    color : 'inherit' | 'primary' | 'secondary'
    name : string
}
const SuperButton = React.memo((props : SuperButtonPropsType) => {
    console.log("super button")
    return (
        <Button variant={props.filter === props.name ? 'contained' : 'text'}
                onClick={props.callBack}
                color={props.color}
        >{props.name}
        </Button>
    );
});

export default SuperButton;