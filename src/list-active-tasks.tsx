import { showToast, Toast, List } from "@raycast/api";
import { useState, useEffect } from "react";
import { getActiveTasks, getAllProjects } from "./api";
import ProjectsDropdown from "./components/ProjectsDropdown";
import { Task } from "./types/types";

const Command = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Set<string>>(new Set([]));

  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await getActiveTasks();
        setTasks(data);
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Error",
          message: `${error}`,
        });
      }
    };

    const getProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Error",
          message: `${error}`,
        });
      }
    };

    getTasks();
    getProjects();
  }, []);

  const onProjectChange = (newValue: string) => {
    // TODO:
    console.log(newValue);
  };

  // send appropriate tasks filtered by project selected to TasksList
  return (
    <List
      navigationTitle="filter by project"
      searchBarPlaceholder="project"
      searchBarAccessory={<ProjectsDropdown projects={projects} onProjectChange={onProjectChange} />}
    >
      {tasks.map((task) => (
        <List.Item id={task.uuid} title={task.description} key={task.uuid} />
      ))}
    </List>
  );
};

export default Command;
