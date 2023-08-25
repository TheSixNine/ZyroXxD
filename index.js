const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");
const http = require("http");
const axios = require("axios");
const semver = require("semver");
const logger = require("./utils/log");
const chalk = require("chalk");
var uptimelink = [`https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`]
const Monitor = require('ping-monitor');
for (const now of uptimelink) {
  const monitor = new Monitor({
    website: `${now}`,
    title: '   AD',
    interval: 30,
  config: {
    intervalUnits: 'seconds'
  }
});
monitor.on('up', (res) => console.log(chalk.bold.hex("#00FF00")("[   AD ]  ") + chalk.hex("#00FF00")(`${res.website}`)))
monitor.on('down', (res) => console.log(chalk.bold.hex("#FF0000")("[ DOWN ]  ") + chalk.hex("#FF0000")(`${res.website} ${res.statusMessage}`)))
monitor.on('stop', (website) => console.log(chalk.bold.hex("#FF0000")("[ STOP ]  ") + chalk.hex("#FF0000")(`${website}`)))
monitor.on('error', (error) => console.log(chalk.bold.hex("#FF0000")("[ ERROR ]  ") + chalk.hex("#FF0000")(`${error}`)))
}

const express = require('express');
const app = express();

const port = process.env.PORT || 5000
     
app.listen(port, () =>
	logger(`Your app is listening a http://localhost:${port}`, "[ ONLINE ]")
     );      

logger("Opened server site...", "[ Starting ]");

function startBot(message) {
    (message) ? logger(message, "[ Starting ]") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "mirai.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot("Restarting...");
            global.countRestart += 1;
            return;
        } else return;
    });

    child.on("error", function (error) {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
    });
};

axios.get("https://raw.githubusercontent.com/Mrchandu7/chandv2/main/package.json").then((res) => {


});
startBot();
app.get('/', (req, res) => res.sendFile(__dirname+'/index.html'))
