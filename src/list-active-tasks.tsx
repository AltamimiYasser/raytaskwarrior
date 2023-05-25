import { showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { getActiveTasks } from "./api";
import TasksList from "./components/tasks-list";
import { Task } from "./types/types";

const Command = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const getTasks = async () => {
      setTasks(await getActiveTasks());
      // try {
      //   const data = await getActiveTasks();
      //   setTasks(data);
      // } catch (error) {
      //   await showToast({
      //     style: Toast.Style.Failure,
      //     title: "Error",
      //     message: `${error}`,
      //   });
      // }
    };
    getTasks();
  }, []);

  return <TasksList tasks={tasks} />;
};

export default Command;
