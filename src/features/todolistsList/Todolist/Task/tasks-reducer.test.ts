import {
    TasksBusinessType,
    tasksReducer, tasksThunk, UpdateTaskBusinessModelType
} from './tasks-reducer';
import {addTodolistAC, removeTodolistAC} from '../todolist-reducer';
import {TaskPriorities, TaskStatuses, UpdateTaskModelType} from "../../../../DAL/API";
import {v1} from "uuid";

let startState: TasksBusinessType = {};
beforeEach(() => {
    startState = {
        "todolistId1": [
            {id: "1", title: "HTML&CSS", status: TaskStatuses.New, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId1",
                order : 0, addedDate : "" , entityStatus : "idle"},
            {id: "2", title: "JS", status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId1",
                order : 0, addedDate : "" , entityStatus : "idle"},
            {id: "3", title: "React", status: TaskStatuses.New, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId1",
                order : 0, addedDate : "" , entityStatus : "idle"}

        ],
        "todolistId2": [
            {id: "1", title: "Milk",status: TaskStatuses.New, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId2",
                order : 0, addedDate : "" , entityStatus : "idle"},
            {id: "2", title: "React Book", status: TaskStatuses.Completed, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId2",
                order : 0, addedDate : "", entityStatus : "idle"},
            {id: "3", title: "React Book", status: TaskStatuses.New, description: "",
                priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId2",
                order : 0, addedDate : "", entityStatus : "idle"}
        ]
    };
});

test('correct task should be deleted from correct array', () => {
    const action = tasksThunk.removeTask.fulfilled({ todolistId : "todolistId2", taskId : "2" }, "", { todolistId : "todolistId2", taskId : "2"} );

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(2);
    expect(endState["todolistId2"].every(t => t.id != "2")).toBeTruthy();
});
test('correct task should be added to correct array', () => {
    const task = {id: "4", title: "juce",status: TaskStatuses.New, description: "",
        priority : TaskPriorities.Low, startDate : "", deadline : "", todoListId : "todolistId2",
        order : 0, addedDate : "" }
    const action = tasksThunk.createTask.fulfilled( {task}, "requestId", {title : task.title, todolistId : task.todoListId} );

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juce");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});
test('status of specified task should be changed', () => {
    const task = startState["todolistId2"].find(t => t.id === "2")
    if(!task) return
    const ApiModel: UpdateTaskBusinessModelType = {
        title: task.title, status: TaskStatuses.New, deadline: task.deadline,
        startDate: task.startDate, priority: task.priority, description: task.description
    }
    const action = tasksThunk.updateTask.fulfilled( { taskId : "2",todolistId : "todolistId2",  BusinessModel : ApiModel }, "",{ taskId : "2", BusinessModel : ApiModel,todolistId : "todolistId2" } );

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
});
test('title of specified task should be changed', () => {
    const task = startState["todolistId2"].find(t => t.id === "2")
    if(!task) return
    const ApiModel: UpdateTaskModelType = {
        title: "yogurt", status: task.status, deadline: task.deadline,
        startDate: task.startDate, priority: task.priority, description: task.description
    }
    const action = tasksThunk.updateTask.fulfilled( { taskId : "2", BusinessModel :  ApiModel , todolistId :  "todolistId2" },"", { taskId : "2", BusinessModel :  ApiModel , todolistId :  "todolistId2" });

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].title).toBe("JS");
    expect(endState["todolistId2"][1].title).toBe("yogurt");
    expect(endState["todolistId2"][0].title).toBe("Milk");
});
test('new array should be added when new todolist is added', () => {
    const action = addTodolistAC( { todolist : {id: v1(), title : "new todolist", addedDate : "", order : 0} });

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});
test('property with todolistId should be deleted', () => {
    const action = removeTodolistAC(  { todolistId : "todolistId2" } ) ;

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});
