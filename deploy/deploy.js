const fs = require("fs");
const { exec } = require("child_process");


currentProject = () => {
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

    currentProject();
}

updateCurrentProject = () => {
    exec("clasp push && cd gs && clasp pull && cd ..", (error, stdout, stderr) => {
        if (error) {
            console.log(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

deployToAllProjects = () => {
    const projects = require('./projectsIds.json');

    console.log("Proyectos:")
    for (project of projects) {
        changeClaspProject(project.id);

        console.log("Pulling to", project.name)
        exec("clasp push", (error, stdout, stderr) => {
            if (error) {
                console.log(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }
}

module.exports.currentProject = currentProject;
module.exports.changeClaspProject = changeClaspProject;
module.exports.updateCurrentProject = updateCurrentProject;
module.exports.deployToAllProjects = deployToAllProjects;