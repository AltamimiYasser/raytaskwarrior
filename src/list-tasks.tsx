import { useState, useEffect } from "react";
import { getActiveTasks } from "./api";
import { Detail, List } from "@raycast/api";
import { Task } from "./types/types";

const Command = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getActiveTasks().then((data) => {
      setTasks(data);
    });
  });

  return (
    <>
      <List>
        {tasks.map((task) => (
          <List.Item key={task.uuid} title={task.description} />
        ))}
      </List>
    </>
  );
};

export default Command;
