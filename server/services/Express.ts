import path from "path";
import fs from "fs";
import Carbon from "../datetime/Carbon";

class Express {
  /**
   * Writes the serialized content of a variable to a log file.
   * The log file will be created at `rootapplication/tmp/{logName}.log`.
   *
   * Usage:
   *   log({ key: 'value' }, 'debug'); // Writes the object to `tmp/debug.log`
   *
   * @param {any} variable - The variable to write into the log file. Can be any type (string, object, array, etc.).
   * @param {string} logName - The name of the log file (without extension).
   * @returns {void}
   */

  static log(value: unknown, destination: string, text: string = ""): void {
    const dirPath: string = path.join(__dirname, "..", "..", "..", "tmp");
    const logPath: string = path.join(dirPath, `${destination}.log`);
    const timestamp: string = Carbon.getDateTime();

    const logMessage: string = `${timestamp} ${text}\n${
      typeof value === "object" ? JSON.stringify(value, null, 2) : value
    }\n\n`;

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fs.existsSync(logPath)) {
      fs.writeFileSync(logPath, "", "utf8");
    }

    if (env("NODE_ENV") === "production") {
      console.log(logMessage);
      return;
    }
    fs.appendFileSync(logPath, logMessage, "utf8");
  }
}

export default Express;
