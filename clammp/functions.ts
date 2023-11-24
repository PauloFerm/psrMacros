import { readFileSync, writeFileSync } from "fs";
import { exec } from "child_process";

export interface Project { name: string, id: string };
export interface ClaspFile { scriptId: string, rootDir: string };

export const currentProject = () => {
    const projects: Project[] = require('./projectsIds.json');
    const clasp: ClaspFile = require('../.clasp.json');

    let current = projects.find(project => project.id == clasp.scriptId);

    if (current == undefined) { 
        throw new Error("Unregistered Project"); 
    }

    return current
}

const overwriteId = (path: string, id: string) => {
    let data = readFileSync(path, { encoding: 'utf-8' }); 
    let idRegex = /"scriptId":"[a-zA-Z0-9_-]*"/;
    let newData = data.replace(idRegex, `"scriptId":"${id}"`);
    
    writeFileSync(path, newData, 'utf-8');
}

export const changeClaspProject = (id: string) => {
    // Executed in root directory
    overwriteId('./.clasp.json', id); 
    overwriteId('./gs/.clasp.json', id);
}

const runCommand = async (cmd: string) => {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}

export const updateCurrentProject = () => {
    let command = "clasp push && cd gs && clasp pull && cd ..";
    runCommand(command);
}

export const deployToAllProjects = async () => {
    const projects: Project[] = require('./projectsIds.json');

    console.log("Proyectos:");
    for (let project of projects) {
        await changeClaspProject(project.id);
        runCommand("clasp push");
    }
}
