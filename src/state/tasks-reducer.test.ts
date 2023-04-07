import {
    addTaskAC,
    updateTaskAC,
    removeTaskAC,
    TasksBusinessType,
    tasksReducer
} from './tasks-reducer';
import {addTodolistAC, removeTodolistAC} from './todolists-reducer';
import {TaskPriorities, TaskStatuses} from "../API/API";
import {v1} from "uuid";

let startState: TasksBusinessType = {};
beforeEach(() => {
    startState = {
        "todolistId1": [
            {id: "1", title: "HTML&CSS", status: TaskStatuses.New, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId1",
                order : 0, addedDate : "" },
            {id: "2", title: "JS", status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId1",
                order : 0, addedDate : "" },
            {id: "3", title: "React", status: TaskStatuses.New, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId1",
                order : 0, addedDate : "" }

        ],
        "todolistId2": [
            {id: "1", title: "Milk",status: TaskStatuses.New, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId2",
                order : 0, addedDate : "" },
            {id: "2", title: "React Book", status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId2",
                order : 0, addedDate : ""},
            {id: "3", title: "React Book", status: TaskStatuses.New, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId2",
                order : 0, addedDate : ""}
        ]
    };
});

test('correct task should be deleted from correct array', () => {
    const action = removeTaskAC("2", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(2);
    expect(endState["todolistId2"].every(t => t.id != "2")).toBeTruthy();
});
test('correct task should be added to correct array', () => {
    const action = addTaskAC({id: "4", title: "juce",status: TaskStatuses.New, description: "",
        priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId2",
        order : 0, addedDate : "" });

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juce");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});
test('status of specified task should be changed', () => {
    const action = updateTaskAC("2", {status : TaskStatuses.New}, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.New);
    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
});
test('title of specified task should be changed', () => {
    const action = updateTaskAC("2", { title : "yogurt"}, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].title).toBe("JS");
    expect(endState["todolistId2"][1].title).toBe("yogurt");
    expect(endState["todolistId2"][0].title).toBe("bread");
});
test('new array should be added when new todolist is added', () => {
    const action = addTodolistAC({id: v1(), title : "new todolist", addedDate : "", order : 0});

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});
test('propertry with todolistId should be deleted', () => {
    const action = removeTodolistAC("todolistId2");

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});
