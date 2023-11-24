import { readFileSync, writeFileSync } from "fs";
import { exec } from "child_process";

export interface Project { name: string, sheetId: string, scriptId: string };
export interface ClaspFile { scriptId: string, rootDir: string };

export const currentProject = () => {
    const projects: Project[] = require('./projectsIds.json');
    const clasp: ClaspFile = require('../.clasp.json');

    let current = projects.find(project => project.scriptId == clasp.scriptId);

    if (current == undefined) { 
        throw new Error("Unregistered Project"); 
    }

    return current
}

const overwriteId = (path: string, scriptId: string) => {
    let data = readFileSync(path, { encoding: 'utf-8' }); 
    let idRegex = /"scriptId":"[a-zA-Z0-9_-]*"/;
    let newData = data.replace(idRegex, `"scriptId":"${scriptId}"`);
    
    writeFileSync(path, newData, 'utf-8');
}

export const changeClaspProject = (scriptId: string) => {
    // Executed in root directory
    overwriteId('./.clasp.json', scriptId);
    overwriteId('./gs/.clasp.json', scriptId);
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

    projects.forEach((project) => {
        changeClaspProject(project.scriptId);
        runCommand("clasp push");
    });
}

export const openSheet = (project: Project) => {
    runCommand(`explorer https://docs.google.com/spreadsheets/d/${project.sheetId}`);
}