// import {
//   getTasks,
//   getTask,
//   getActiveTasks,
//   getTasksForProject,
//   getTasksForTag,
//   addTask,
//   deleteTask,
//   markTaskAsDone,
//   modifyTask,
// } from "../src/index.js";
// //
// getTasks().then((tasks) => {
//   if (!tasks) {
//     console.log("no tasks found");
//     return;
//   }
//   tasks.forEach((task) => {
//     if (task.tags) {
//       console.log(task.description);
//       console.log(task.tags);
//       console.log(task.urgency);
//     } else {
//       console.log(task.description);
//       console.log(task.urgency);
//     }
//   });
// });

// getTask("b6c949c2-9227-4567-ae2d-8d48725b8420").then((task) => {
//   console.log(task.uuid);
//   console.log(task.description);
// });

// getActiveTasks().then((task) => console.log(task));
// //
// getTasksForProject("git").then((tasks) => console.log(tasks));

// getTasksForTag("next").then((task) => {
//   console.log(task);
// });

// addTask("my first task 11"); // only task
// addTask("my seoncd task", "my project"); // task and a project
// addTask("my important third task", undefined, "+next"); // task and tag
// addTask("my fourth important task in my project", "my project", "+next"); // task & project & tag

// deleteTask("57a0c3a6-5e39-40b7-9100-f65acd9c3aa9");

// markTaskAsDone("9a2a5f79-7bac-4d7b-acd9-3e6edf2d8206");

// modifyTask("63b00321-bcbd-4f4d-8399-eb1be9ec9a3b", "test from the app"); // change only description

// change only project
// modifyTask(
//   "63b00321-bcbd-4f4d-8399-eb1be9ec9a3b",
//   undefined,
//   "changed project"
// );

// modifyTask("63b00321-bcbd-4f4d-8399-eb1be9ec9a3b", undefined, "-"); // only remove a project

// only add tag
// modifyTask(
//   "63b00321-bcbd-4f4d-8399-eb1be9ec9a3b",
//   undefined,
//   undefined,
//   "+appTag"
// );

// only remove tag
// modifyTask(
//   "63b00321-bcbd-4f4d-8399-eb1be9ec9a3b",
//   undefined,
//   undefined,
//   "-appTag"
// );

// change description and project
// modifyTask(
//   "63b00321-bcbd-4f4d-8399-eb1be9ec9a3b",
//   "description change from app",
//   "new project from app"
// );

// change description and remove project
// modifyTask(
//   "63b00321-bcbd-4f4d-8399-eb1be9ec9a3b",
//   "project should be removed",
//   "-"
// );

// change description and add tag
// modifyTask("63b00321-bcbd-4f4d-8399-eb1be9ec9a3b", "desc", undefined, "+next");

// // change description and remove tag
// modifyTask(
//   "63b00321-bcbd-4f4d-8399-eb1be9ec9a3b",
//   "tag should be removed",
//   undefined,
//   "-next"
// );

// change project & add tag
// modifyTask(
//   "63b00321-bcbd-4f4d-8399-eb1be9ec9a3b",
//   undefined,
//   "project change and tag change",
//   "+next"
// );

// change project & remove tag
// modifyTask(
//   "63b00321-bcbd-4f4d-8399-eb1be9ec9a3b",
//   undefined,
//   "project changed and tag removed",
//   "-next"
// );

// remove project & add tag
// modifyTask("63b00321-bcbd-4f4d-8399-eb1be9ec9a3b", undefined, "-", "+next");

// remove project & add tag
// modifyTask("63b00321-bcbd-4f4d-8399-eb1be9ec9a3b", undefined, "-", "-next");
