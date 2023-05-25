import { List } from "@raycast/api";
import React from "react";
import { Task } from "../types/types";

interface TaskListProps {
  tasks: Task[];
}

const TasksList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <>
      <List>
        {tasks.map((task) => (
          <List.Item id={task.uuid} title={task.description} />
        ))}
      </List>
    </>
  );
};

export default TasksList;
