const pino = require("pino");

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss", // Corrected typo here
      ignore: "pid,hostname",
    },
  },
});

module.exports = logger;
