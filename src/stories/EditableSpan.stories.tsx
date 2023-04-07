import React from "react"
import {EditableSpan} from "../components/EditableSpan";
import {action} from "@storybook/addon-actions";

export default {
    title : "Editable span",
    component : EditableSpan
}

const changeSpanCallBack = action("span should be edit and save new title")
export const EditableSpanBaseExample = () => {
    return (
        <EditableSpan value={"double click here by changed this title"} onChange={changeSpanCallBack}/>
    )
}