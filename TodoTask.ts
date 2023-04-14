export interface TodoTask {
    id: number;
    title: string;
    completed: boolean;
}

export interface TodoTasks {
    tasks: TodoTask[];
}
