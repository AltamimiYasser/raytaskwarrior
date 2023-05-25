import { useState, useEffect } from "react";
import { getActiveTasks } from "./api";
import TasksList from "./components/tasks-list";
import { Task } from "./types/types";

const Command = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getActiveTasks().then((data) => {
      setTasks(data);
    });
  });

  return <TasksList tasks={tasks} />;
};

export default Command;
