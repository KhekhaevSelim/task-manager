import {AddItemForm} from "../AddItemForm";
import React, {ChangeEvent,KeyboardEvent, useState} from "react"
import {action} from "@storybook/addon-actions";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import TextField from "@mui/material/TextField/TextField";
import {IconButton} from "@mui/material";
import {AddBox} from "@mui/icons-material";
export default {
    title: "AddItemForm",
    component: AddItemForm,
    argTypes : {
        onClick : {
            description : "Button clicked inside form"
        }
    },
}as ComponentMeta<typeof AddItemForm>
const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;
export const AddItemFormBaseExample = Template.bind({})
AddItemFormBaseExample.args = {
    addItem: action('Button clicked inside form')
}

const Template1: ComponentStory<typeof AddItemForm> = (args) => {

    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>('Title is required')

    const addItem = () => {
        if (title.trim() !== "") {
            args.addItem(title);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (e.charCode === 13) {
            addItem();
        }
    }

    return <div>
        <TextField variant="outlined"
                   error={!!error}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   label="Title"
                   helperText={error}
        />
        <IconButton color="primary" onClick={addItem}>
            <AddBox />
        </IconButton> !
    </div>
} ;

export const AddItemFormErrorStory = Template1.bind({});