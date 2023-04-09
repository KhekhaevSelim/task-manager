import React from "react"
import Task from "./Task"
import {action} from "@storybook/addon-actions";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {TaskPriorities, TaskStatuses} from "../../../../DAL/API";
import {v1} from "uuid";

export default {
    title: 'TODOLISTS/Task',
    component: Task,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    args: {
        changeTaskStatus: action('changeTaskStatus'),
        changeTaskTitle: action('changeTaskTitle'),
        removeTask: action('removeTask'),
        task: {id: v1(), title: "Milk",status: TaskStatuses.Completed, description: "",
            priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "1232343dfdf",
            order : 0, addedDate : "" },
        todolistId: '1232343dfdf',
    }

} as ComponentMeta<typeof Task>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args


export const TaskIsNotDoneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsNotDoneStory.args = {
    task: {id: v1(), title: "Milk",status: TaskStatuses.Completed, description: "",
        priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId2",
        order : 0, addedDate : "" }
}