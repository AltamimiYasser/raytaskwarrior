import { showToast, Toast, List, popToRoot } from "@raycast/api";
import { useState, useEffect } from "react";
import { getActiveTasks, getAllProjects, getTasksForProject } from "./api";
import ProjectsDropdown from "./components/ProjectsDropdown";
import { Task } from "./types/types";

const Command = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Set<string>>(new Set([]));
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const getProjects = async () => {
      try {
        setisLoading(true);
        const data = await getAllProjects();
        setisLoading(false);
        setProjects(data);
      } catch (error) {
        setisLoading(false);
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

  const getTasks = async () => {
    try {
      setisLoading(true);
      const data = await getActiveTasks();
      setisLoading(false);
      setTasks(data);
    } catch (error) {
      setisLoading(false);
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: `${error}`,
      });
      popToRoot();
    }
  };

  const filterByProject = async (project: string) => {
    if (project === "All") {
      getTasks();
    } else {
      try {
        console.log(`project changed to ${project}`);
        const data = await getTasksForProject(project);
        console.log(data);
        setTasks(data);
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Error",
          message: `${error}`,
        });
      }
    }
  };

  const onProjectChange = (newValue: string) => {
    filterByProject(newValue);
  };

  // send appropriate tasks filtered by project selected to TasksList
  return (
    <List
      navigationTitle="filter by project"
      isLoading={isLoading}
      searchBarAccessory={
        <ProjectsDropdown projects={projects} onProjectChange={onProjectChange} isLoading={isLoading} />
      }
    >
      {tasks.length === 0 ? (
        // TODO: add actions to add a new task
        <List.EmptyView title="No Tasks Found" description="make sure you have added at least one task." />
      ) : (
        // TODO: add accessories to show other info about the task
        tasks.map((task) => <List.Item id={task.uuid} title={task.description} key={task.uuid} />)
      )}
    </List>
  );
};

export default Command;
