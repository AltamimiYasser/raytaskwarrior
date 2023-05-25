import { exec } from "child_process";
import { promisify } from "util";
import { Task, Status } from "./types/types";

const execPromise = promisify(exec);

// returns a list of all tasks sorted by urgency
export const getTasks = async () => {
  let tasks: Task[] = [];
  try {
    // TODO: take the path to task from user
    const command = "/opt/homebrew/bin/task export rc.json.array:on";
    const { stdout, stderr } = await execPromise(command);
    if (stderr) console.error(stderr);

    const data = JSON.parse(stdout) as Task[];
    if (data) tasks = data.sort((a, b) => b.urgency - a.urgency);
  } catch (error) {
    console.error(error);
  }
  return tasks;
};

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
export const getTasksForTag = async (tag = "next") => {
  const tasks = await getTasks();
  return tasks.filter((task) => task.tags && task.tags.includes(tag) && task.status === Status.Pending);
};

// adds a task and optionally can add a project or a tag or both
export const addTask = async (description: string, project?: string, tag?: string) => {
  // only description -> task add "<description>"
  let command = "";
  if (typeof project === "undefined" && typeof tag === "undefined") {
    command = `task add "${description}"`;
  }

  // description & project -> task add <description> project:<project>
  else if (typeof project !== "undefined" && typeof tag === "undefined") {
    command = `task add "${description}" project:"${project}"`;
  }

  // description & tag -> task add <description> +<tag>
  else if (typeof project === "undefined" && typeof tag !== "undefined") {
    command = `task add "${description}" ${tag}`;
  }

  // description & tag & project task add <description> project:<project> +<tag>
  else if (typeof project !== "undefined" && typeof tag !== "undefined") {
    command = `task add "${description}" project:"${project}" ${tag}`;
  }

  // execute command
  try {
    const { stderr } = await execPromise(command);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(error);
  }
};

// delete task by its uuid
export const deleteTask = async (uuid: string) => {
  try {
    const { stderr } = await execPromise(`task delete ${uuid} rc.confirmation:off`);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(error);
  }
};

// mark a task as done by its uuid
export const markTaskAsDone = async (uuid: string) => {
  try {
    const { stderr } = await execPromise(`task ${uuid} done`);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(error);
  }
};

// tag is passed like this (+next) (-next) + to add and - to remove
export const modifyTask = async (uuid: string, description?: string, project?: string, tag?: string) => {
  let command = "";

  // change description only:
  if (typeof description !== "undefined" && typeof project === "undefined" && typeof tag === "undefined") {
    command = `task modify ${uuid} "${description}"`;
  }

  // change and remove project
  if (typeof description === "undefined" && typeof project !== "undefined" && typeof tag === "undefined") {
    // change project only
    if (project !== "-") command = `task modify ${uuid} project:"${project}"`;

    // Remove project only
    if (project === "-") command = `task modify ${uuid} project:`;
  }

  // add and remove tag
  if (typeof description === "undefined" && typeof project === "undefined" && typeof tag !== "undefined") {
    command = `task modify ${uuid} ${tag}`;
  }

  if (typeof description !== "undefined" && typeof project !== "undefined" && typeof tag === "undefined") {
    // Change description, change project
    if (project !== "-") command = `task modify ${uuid} "${description}" project:"${project}"`;

    // Change description, remove project
    if (project === "-") command = `task modify ${uuid} "${description}" project:`;
  }

  // Change description & add or remove tag
  if (typeof description !== "undefined" && typeof project === "undefined" && typeof tag !== "undefined") {
    command = `task modify ${uuid} "${description}"  ${tag}`;
  }

  if (typeof description === "undefined" && typeof project !== "undefined" && typeof tag !== "undefined") {
    // Change project, add or remove tag
    if (project !== "-") command = `task modify ${uuid} project:"${project}" ${tag}`;

    // Remove project, add or remove tag
    if (project === "-") command = `task modify ${uuid} project: ${tag}`;
  }

  if (typeof description !== "undefined" && typeof project !== "undefined" && typeof tag !== "undefined") {
    // Change description, change project, add or remove tag
    if (project !== "-") command = `task modify ${uuid} "${description}" project:"${project}" ${tag}`;

    // Change description, remove project, add or remove tag
    if (project === "-") command = `task modify "${description}" ${uuid} project: ${tag}`;
  }

  // execute command
  try {
    const { stderr } = await execPromise(command);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(error);
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
