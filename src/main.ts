#!/usr/bin/env node
import { argv, exit } from "process";
import { red, green, blue } from "chalk";
import { exec } from "shelljs";

console.info(`${red("File")}->${green("New")}->${blue("Project")}`);

const args = [...argv];
args.splice(0, 2);

if (args.length === 0) {
    console.error("Please provide the name of a GitHub repository to clone.");
    exit(1);
}

exec(`git clone https://github.com/${args[0]}.git`);
