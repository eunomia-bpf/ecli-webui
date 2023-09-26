import { LogType, type GetTaskLogResponseInnerLog } from "@/api-client";

export class Log implements GetTaskLogResponseInnerLog {
    log_type: LogType;
    timestamp: number;
    log: string;

    constructor(log_type: LogType, timestamp: number, log: string) {
        this.log_type = log_type;
        this.timestamp = timestamp;
        this.log = log;
    }

    concat(): string {
        return `${this.timestamp} ${this.log}`;
    }
}
