import { showToast, Toast, List, popToRoot, Action, ActionPanel } from '@raycast/api';
import { useState, useEffect } from 'react';
import { getActiveTasks, getAllProjects, getTasksForProject } from './api';
import ProjectsDropdown from './components/ProjectsDropdown';
import { Task } from './types/types';
import Details from './components/Details';

const ListActiveTabs = () => {
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
          title: 'Error',
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
        title: 'Error',
        message: `${error}`,
      });
      popToRoot();
    }
  };

  const filterByProject = async (project: string) => {
    if (project === 'All') {
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
          title: 'Error',
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
      navigationTitle='filter by project'
      searchBarAccessory={
        <ProjectsDropdown projects={projects} onProjectChange={onProjectChange} />
      }
    >
      {tasks.length === 0 ? (
        // TODO: add actions to add a new task when there are not tasks to display
        <List.EmptyView
          title='No Tasks Found'
          description='make sure you have added at least one task.'
        />
      ) : (
        tasks.map((task) => (
          <List.Item
            id={task.uuid}
            keywords={[task.tags?.join(' ') || '', task.project || '']}
            title={task.description}
            key={task.uuid}
            accessories={[{ text: task.project }]}
            actions={
              // TODO: Add more actions: (modify, delete, mark as done)
              // check raycast default actions to add what fits
              <ActionPanel>
                <Action.Push title='Details' target={<Details task={task} />} />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
};

export default ListActiveTabs;
