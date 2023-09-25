import { ecliApi } from "@/api";
import { type TaskListResponse, type TaskListResponseTasksInner, TaskStatus } from "@/api-client";

export class Tasks implements TaskListResponseTasksInner {
    name: string;
    status: TaskStatus;
    id: number;

    constructor(name: string, status: string, id: number) {
        this.name = name;
        this.status = status as TaskStatus;
        this.id = id;
    }
}

export class Server {
    name: string;
    url: string;
    tasks: Array<Tasks> = [];

    constructor(
        name: string,
        url: string,
    ) {
        this.name = name;
        this.url = url;
    };

    private async getTasks(): Promise<Array<Tasks>> {
        try {
            const response = await ecliApi.getTaskList();
            const data = response.data;
            return (data && data.tasks) ? data.tasks.map((taskData: any) =>
                new Tasks(taskData.name, taskData.status, taskData.id)) : [];
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

