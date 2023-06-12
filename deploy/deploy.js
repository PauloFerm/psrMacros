const fs = require("fs");
//const { exec } = require("child_process");
const { exec } = require('child_process');

logCurrentProject = () => {
    const projects = require('./projectsIds.json');
    const clasp = require('../.clasp.json');

    current = projects.filter(project => project.id == clasp.scriptId)[0];

    console.log("Current project:", current.name);
}

changeClaspProject = (id) => {
    let path = './.clasp.json';     // executed in root directory
    let data = fs.readFileSync(path, { encoding: 'utf-8' });
    let newData = data.replace(/"scriptId":"[a-zA-Z0-9_-]*"/, `"scriptId":"${id}"`)
    
    fs.writeFileSync(path, newData, 'utf-8');

    let pathPull = './gs/.clasp.json';     // executed in root directory
    let dataPull = fs.readFileSync(pathPull, { encoding: 'utf-8' });
    let newDataPull = dataPull.replace(/"scriptId":"[a-zA-Z0-9_-]*"/, `"scriptId":"${id}"`)
    
    fs.writeFileSync(pathPull, newDataPull, 'utf-8');
}

runCommand = async (cmd) => {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}

updateCurrentProject = () => {
    let command = "clasp push && cd gs && clasp pull && cd ..";
    runCommand(command);
}

deployToAllProjects = async () => {
    const projects = require('./projectsIds.json');

    console.log("Proyectos:")
    for (let project of projects) {
        await changeClaspProject(project.id);
        runCommand("clasp push");
    }
}

module.exports.logCurrentProject = logCurrentProject;
module.exports.changeClaspProject = changeClaspProject;
module.exports.updateCurrentProject = updateCurrentProject;
module.exports.deployToAllProjects = deployToAllProjects;