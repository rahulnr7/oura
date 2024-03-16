import { spawn } from "child_process"
import  fs from "fs"

// Sample Oura command to execute
// 'oura daemon --config daemon.toml --cursor 116956876,2760ee4207c51344154116cb465138a99eb7214cd8c2fdf1486cd81994ce50e0'

//replace Param1
const parm1 = "118995024";

//replace param2
const parm2 =
  "b8695cf98aa41c6b7d3803df45b62d244621d5d16fa16ba6a0a1a3f8fdf1cdc2";

// Use the full path to the 'oura' executable
const ouraPath = "/usr/local/bin/oura";
const args = [
  "daemon",
  "--config",
  "daemon.toml",
  "--cursor",
  `${parm1},${parm2}`,
];

// Execute the command
const child = spawn(ouraPath, args);

// Store the output in a file
const outputFile = "output.txt";
const outputStream = fs.createWriteStream(outputFile);

// Pipe the child process stdout to the output file
child.stdout.pipe(outputStream);
// Set a timeout to kill the child process after 3 seconds
const timeout = setTimeout(() => {
  console.log("Timeout reached. Stopping execution.");
  child.kill("SIGINT"); // Send a SIGINT signal to gracefully terminate the child process
}, 3000); // 3 seconds

// Listen for the child process to exit
child.on("exit", (code, signal) => {
  clearTimeout(timeout); // Clear the timeout when the process exits
  console.log(`Child process exited with code ${code} and signal ${signal}`);
});

// Listen for any output from the child process
child.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

child.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});
