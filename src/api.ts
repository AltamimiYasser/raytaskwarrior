import { exec } from 'child_process';
import { promisify } from 'util';
import { Task, Status } from './types/types';
import { getPreferenceValues } from '@raycast/api';

const execPromise = promisify(exec);
const taskPath = getPreferenceValues().taskPath;

const overrideError = 'Configuration override rc.json.array:on\n';
const command = `${taskPath} export rc.json.array:on`;

// TODO: Fix project methods doesn't need '-' passed to be removed
// change tags to be a set
//
// returns a list of all tasks sorted by urgency
export const getTasks = async () => {
  let tasks: Task[] = [];
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stderr && stderr !== overrideError) {
      throw new Error('please make sure you have set the path to task in the extension settings');
    }

    const data = JSON.parse(stdout) as Task[];
    if (data) tasks = data.sort((a, b) => b.urgency - a.urgency);
  } catch (error) {
    throw new Error('Please make sure you have set the path to task in the settings');
  }
  return tasks;
};

// TODO: maybe not needed
//
// returns a single task by its uuid
export const getTask = async (uuid: string) => {
  const tasks = await getTasks();
  return tasks.find((task) => task.uuid === uuid);
};

// returns all pending tasks
export const getActiveTasks = async () => {
  const tasks = await getTasks();
  return tasks.filter((task) => task.status === Status.Pending);
};

// returns pending tasks for a project
export const getTasksForProject = async (project: string) => {
  const tasks = await getTasks();
  // Testing => must give me the active task in the next tag
  return tasks.filter((task) => task.project === project && task.status === Status.Pending);
};

// returns all pending tasks for a tag (defaults to next)
export const getTasksForTag = async (tag = 'next') => {
  const tasks = await getTasks();
  return tasks.filter(
    (task) => task.tags && Array.from(task.tags).includes(tag) && task.status === Status.Pending
  );
};

// adds a task and optionally can add a project or a tag or both
export const addTask = async (description: string, project?: string, tag?: string) => {
  // only description -> task add "<description>"
  let command = '';
  if (typeof project === 'undefined' && typeof tag === 'undefined') {
    command = `${taskPath} add "${description}"`;
  }

  // description & project -> task add <description> project:<project>
  else if (typeof project !== 'undefined' && typeof tag === 'undefined') {
    command = `${taskPath} add "${description}" project:"${project}"`;
  }

  // description & tag -> task add <description> +<tag>
  else if (typeof project === 'undefined' && typeof tag !== 'undefined') {
    command = `${taskPath} add "${description}" ${tag}`;
  }

  // description & tag & project task add <description> project:<project> +<tag>
  else if (typeof project !== 'undefined' && typeof tag !== 'undefined') {
    command = `${taskPath} add "${description}" project:"${project}" ${tag}`;
  }

  // execute command
  try {
    const { stderr } = await execPromise(command);
    if (stderr) console.error(stderr);
  } catch (error) {
    throw new Error(`error in addTask function: "${error}"`);
  }
};

// delete task by its uuid
export const deleteTask = async (uuid: string) => {
  try {
    const { stderr } = await execPromise(`${taskPath} delete ${uuid} rc.confirmation:off`);
    if (stderr) console.error(stderr);
  } catch (error) {
    throw new Error(`error in deleteTask function: "${error}"`);
  }
};

// mark a task as done by its uuid
export const markTaskAsDone = async (uuid: string) => {
  try {
    const { stderr } = await execPromise(`${taskPath} ${uuid} done`);
    if (stderr) console.error(stderr);
  } catch (error) {
    throw new Error(`error in markTaskAsDone function: "${error}"`);
  }
};

// tag is passed like this (+next) (-next) + to add and - to remove
export const modifyTask = async (
  uuid: string,
  description?: string,
  project?: string,
  tags?: string[]
) => {
  let command = '';

  // change description only:
  if (
    typeof description !== 'undefined' &&
    typeof project === 'undefined' &&
    typeof tags === 'undefined'
  ) {
    command = `${taskPath} modify ${uuid} "${description}"`;
  }

  // change and remove project
  if (
    typeof description === 'undefined' &&
    typeof project !== 'undefined' &&
    typeof tags === 'undefined'
  ) {
    // change project only
    if (project !== '-') command = `${taskPath} modify ${uuid} project:"${project}"`;

    // Remove project only
    if (project === '-') command = `${taskPath} modify ${uuid} project:`;
  }

  // add and remove tags
  if (
    typeof description === 'undefined' &&
    typeof project === 'undefined' &&
    typeof tags !== 'undefined'
  ) {
    command = `${taskPath} modify ${uuid} ${tags.join(' ')}`;
  }

  if (
    typeof description !== 'undefined' &&
    typeof project !== 'undefined' &&
    typeof tags === 'undefined'
  ) {
    // Change description, change project
    if (project !== '-')
      command = `${taskPath} modify ${uuid} "${description}" project:"${project}"`;

    // Change description, remove project
    if (project === '-') command = `${taskPath} modify ${uuid} "${description}" project:`;
  }

  // Change description & add or remove tag
  if (
    typeof description !== 'undefined' &&
    typeof project === 'undefined' &&
    typeof tags !== 'undefined'
  ) {
    command = `${taskPath} modify ${uuid} "${description}"  ${tags.join(' ')}`;
  }

  if (
    typeof description === 'undefined' &&
    typeof project !== 'undefined' &&
    typeof tags !== 'undefined'
  ) {
    // Change project, add or remove tag
    if (project !== '-')
      command = `${taskPath} modify ${uuid} project:"${project}" ${tags.join(' ')}`;

    // Remove project, add or remove tag
    if (project === '-') command = `${taskPath} modify ${uuid} project: ${tags.join(' ')}`;
  }

  if (
    typeof description !== 'undefined' &&
    typeof project !== 'undefined' &&
    typeof tags !== 'undefined'
  ) {
    // Change description, change project, add or remove tag
    if (project !== '-')
      command = `${taskPath} modify ${uuid} "${description}" project:"${project}" ${tags.join(
        ' '
      )}`;

    // Change description, remove project, add or remove tag
    if (project === '-')
      command = `${taskPath} modify "${description}" ${uuid} project: ${tags.join(' ')}`;
  }

  // execute command
  try {
    const { stderr } = await execPromise(command);
    if (stderr) console.error(stderr);
  } catch (error) {
    throw new Error(`error in modifyTask function: "${error}"`);
  }
};

// deletes all tasks in projects and thus deletes the project
export const deleteProject = async (project: string) => {
  const tasks = await getTasksForProject(project);
  if (tasks.length == 0) {
    console.log(`project ${project} doesn't exist`);
    return;
  }

  for (const task of tasks) {
    await deleteTask(task.uuid);
  }
};

// returns all projects with active tasks
export const getAllProjects = async () => {
  const tasks = await getActiveTasks();
  const projects = new Set<string>();
  tasks.forEach((task) => {
    if (task.project) projects.add(task.project);
  });
  projects.add('All');
  return projects;
};
