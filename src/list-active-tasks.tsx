import { showToast, Toast, List, popToRoot, Action, ActionPanel, Detail } from "@raycast/api";
import { useState, useEffect } from "react";
import { getActiveTasks, getAllProjects, getTasksForProject } from "./api";
import ProjectsDropdown from "./components/ProjectsDropdown";
import { Task } from "./types/types";

const Command = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Set<string>>(new Set([]));

  useEffect(() => {
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

  return (
    <List
      navigationTitle="filter by project"
      searchBarAccessory={<ProjectsDropdown projects={projects} onProjectChange={onProjectChange} />}
    >
      {tasks.length === 0 ? (
        // TODO: add actions to add a new task
        // we can use Action.Push to push another view see example at the end of the file
        <List.EmptyView title="No Tasks Found" description="make sure you have added at least one task." />
      ) : (
        // TODO: on Enter: open task details page
        tasks.map((task) => (
          <List.Item
            id={task.uuid}
            title={task.description}
            key={task.uuid}
            accessories={[{ text: task.project }]}
            actions={
              <ActionPanel>
                <Action.Push title="Details" target={<Details task={task} />} />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
};

const Details = (props: { task: Task }) => {
  const { task: task } = props;
  return (
    <>
      <Detail markdown={`# ${task.description}`} />
    </>
  );
};

// const ProjectsDropdown = (props: { projects: Set<string>; onProjectChange: (newValue: string) => void }) => {
//   const { projects: projects, onProjectChange: onProjectChange } = props;

export default Command;

// import { ActionPanel, Detail, Action } from "@raycast/api";
//
// function Ping() {
//   return (
//     <Detail
//       markdown="Ping"
//       actions={
//         <ActionPanel>
//           <Action.Push title="Push Pong" target={<Pong />} />
//         </ActionPanel>
//       }
//     />
//   );
// }
//
// function Pong() {
//   return <Detail markdown="Pong" />;
// }
//
// export default function Command() {
//   return <Ping />;
// }
