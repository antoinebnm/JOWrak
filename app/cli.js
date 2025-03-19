const clear = require("clear");
const inquirer = require("inquirer").default;
const figlet = require("figlet");

// Dynamically import `open` (since it's an ES module)
async function openURL(url) {
  const open = (await import("open")).default;
  await open(url);
}

function printFiglet(text) {
  return new Promise((resolve, reject) => {
    figlet.text(text, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      console.log(data);
      resolve();
    });
  });
}

process.on("SIGUSR2", function () {
  gracefulShutdown(function () {
    process.kill(process.pid, "SIGTERM");
  });
});

// Function to handle user inputs
async function promptUser() {
  const { action } = await inquirer.prompt([
    {
      type: "input",
      name: "action",
      message:
        "Type 'o' to open the app, 'c' to close the app and wait for a restart, 'q' to quit:\n",
    },
  ]);

  if (action === "o") {
    console.log("🌍 Opening the app...");
    const _uri =
      `${process.env.URI ? process.env.URI : "http://localhost"}` +
      `${process.env.PORT ? ":" + process.env.PORT : ""}`;
    await openURL(_uri);
  } else if (action === "c") {
    console.log(
      "Clean App closing, waiting for a file modification to restart."
    );
    process.exit(0);
  } else if (action === "q") {
    console.log("🛑 Exiting CLI...");
    process.kill(process.ppid, "SIGTERM");
    process.exit(0);
  }

  startCLI();
}

async function startCLI() {
  clear();
  await printFiglet("JOWrak 's    CLI");
  console.log("\n🚀 Use the commands below to control the app.");
  promptUser();
}

// 🛑 Do NOT auto-run the CLI when the file is required.
module.exports = { startCLI };
