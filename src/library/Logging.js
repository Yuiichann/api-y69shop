const chalk = require("chalk");

class Logging {
  info(args) {
    console.log(
      chalk.blue(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === "string" ? chalk.blueBright(args) : args
    );
  }

  warn(args) {
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === "string" ? chalk.yellowBright(args) : args
    );
  }

  success(args) {
    console.log(
      chalk.green(`[${new Date().toLocaleDateString()}] [SUCCESS]`),
      typeof args === "string" ? chalk.greenBright(args) : agrs
    );
  }

  error(args) {
    console.log(
      chalk.red(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === "string" ? chalk.redBright(args) : args
    );
  }
}

module.exports = new Logging();
