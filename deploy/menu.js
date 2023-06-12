const inquirer = require('@inquirer/prompts');
const deploy = require('./deploy.js')

selectProject = async () => {
    projects = require('./projectsIds.json'); //.map(project => project.name);

    const selectedProject = await inquirer.select({
        name: "project",
        message: "Select a Project to deploy:",
        choices: projects.map( (project) => {
            return {
                name: project.name,
                value: project
            }
        })
    });

    return selectedProject
}

launchMenu = async () => {

    const option = await inquirer.select({
        name: "action",
        message: "Select an option",
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
                name: "View current project",
                value: "current"
            },
            {
                name: "Change current project",
                value: "change"
            }
        ]
    });

    switch (option) {
        case "update":
            deploy.updateCurrentProject();
            break;
        case "deploy":
            deploy.deployToAllProjects();
            break;
        case "current":
            deploy.logCurrentProject();
            break;
        case "change":
            let selectedProject = await selectProject();
            deploy.changeClaspProject(selectedProject.id);
            deploy.logCurrentProject();
            break;
        default:
            console.log("No action for", option);
    }
}

launchMenu();