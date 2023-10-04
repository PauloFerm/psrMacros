// const inquirer = require('@inquirer/prompts');
import { select } from "@inquirer/prompts";
import * as functions from "./functions";

import { Project } from "./functions";

const selectProjectMenu = async () => {
  let projects: Project[] = require('./projectsIds.json'); 

  const selectedProject = await select({
    message: "Select a Project to deploy:",
    choices: projects.map(project => {
      return {
        name: project.name,
        value: project
      }
    })
  });

  return selectedProject
}

const mainMenu = async () => {
  let currentProject = functions.currentProject();

  const option = await select({
    message: `Current project: ${currentProject.name}`,
    choices: [
      {
        name: "Update current project",
        value: "update"
      },
      {
        name: "Deploy to all projects",
        value: "deploy"
      },
      {
        name: "Change current project",
        value: "change"
      },
      {
        name: "Exit Menu",
        value: "exit"
      }
    ]
  });

  switch (option) {
    case "update":
      functions.updateCurrentProject();
      break;
    case "deploy":
      functions.deployToAllProjects();
      break;
    case "change":
      let selectedProject = await selectProjectMenu();
      functions.changeClaspProject(selectedProject.id);
      console.log(`Current project: ${selectedProject.name}`);
      mainMenu();
      break;
    case "exit":
      process.exit(1);
    default:
      console.log("No action for", option);
  }

}

export const launchMenu = mainMenu();
