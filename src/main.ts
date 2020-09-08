import { argv } from "process";

console.info("File->New->Project");

for (const arg of argv) {
    console.info(arg);
}
