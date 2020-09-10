#!/usr/bin/env node
import { argv, exit } from "process";
import { red, green, blue } from "chalk";
import { grep, pushd, popd, sed, exec, rm } from "shelljs";

console.info(`${red("File")}->${green("New")}->${blue("Project")}`);

const args = [...argv];
args.splice(0, 2);

if (args.length === 0) {
    console.error(
        red("Please provide the name of a GitHub repository to clone.")
    );
    exit(1);
}

if (args.length === 1) {
    console.error(red("Please provide a name for the new project."));
    exit(1);
}

console.info(`Cloning ${red(args[0])} into ${green(args[1])}...`);
exec(`git clone -q "https://github.com/${args[0]}.git" "${args[1]}"`);

pushd("-q", args[1]);
rm("-rf", ".git");

const regexString = "\\{\\{(.*)\\}\\}";
const glob = "**/*.*";
const regex = /\{\{(.*)\}\}/;
const variables: { [key: string]: string } = {};

for (const line of grep(regexString, glob)
    .split("\n")
    .map((x) => x.trim())) {
    const variableName = regex.exec(line)?.[1];

    if (variableName !== undefined) {
        if (variableName === "NAME") {
            variables[variableName] = args[1];
        } else {
            variables[variableName] = "";
        }
    }
}

// TODO: Ask questions about what values to use for variables here.

for (const variableName of Object.keys(variables)) {
    sed("-i", `\\{\\{${variableName}\\}\\}`, variables[variableName], glob);
}

exec("git init");

popd("-q");
