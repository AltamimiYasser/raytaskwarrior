// import { Task, Status } from "../types/types";
export interface Task {
  uuid: string;
  description: string;
  entry: string;
  modified?: string;
  status: string;
  urgency: number;
  annotations?: string[]; //  TODO: enum?
  start?: string;
  end?: string;
  tags?: string[];
  project?: string;
  [key: string]: any;
}

export enum Status {
  Pending = "pending",
  Deleted = "deleted",
  Completed = "completed",
  Waiting = "waiting",
  Recurring = "recurring",
}
