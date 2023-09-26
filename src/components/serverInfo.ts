export class Server {
    name: string;
    url: string;
    tasks: Task[] = [];

    constructor(
        name: string,
        url: string,
    ) {
        this.name = name;
        this.url = url;
    };

    private async getTasks(): Promise<Array<Task>> {
        try {
            const response = await fetch('/api/task');
            const data = await response.json();
            return (data && data.tasks) ? data.tasks.map((taskData: any) => new Task(taskData.name, taskData.status, taskData.id)) : [];
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }
    }

    async updateTasks() {
        this.getTasks().then((tasks) => {
            this.tasks = tasks;
        });
    }

}

export class Task {
    name: string;
    status: TaskStatus;
    id: number;

    constructor(name: string, status: string, id: number) {
        this.name = name;
        this.status = status as TaskStatus;
        this.id = id;
    }
}

export enum TaskStatus {
    Running = "running",
    Stopped = "stopped",
    Paused = "paused",
    Failed = "failed",
    Completed = "completed",
}
