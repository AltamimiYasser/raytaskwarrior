import { List } from "@raycast/api";
import React from "react";
import { Task } from "../types/types";

interface TaskListProps {
  tasks: Task[];
}

// receive tasks to show
const TasksList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <>
      <List>
        {tasks.map((task) => (
          <List.Item id={task.uuid} title={task.description} key={task.uuid} />
        ))}
      </List>
    </>
  );
};

export default TasksList;
