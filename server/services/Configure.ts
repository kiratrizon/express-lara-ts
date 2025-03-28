import path from "path";
import fs from "fs";
import { loopWhile } from "@kaciras/deasync";

class Configure {
  private static storedData: Record<string, any> = {};
  static basePath: string = path.join(__dirname, "..", "..", "config");

  static read(pathString: string): any {
    let keys: Array<string | number> = pathString.split(".").map((key) => {
      const parsed = Number(key);
      return Number.isInteger(parsed) ? parsed : key;
    });

    let basePath = Configure.basePath;
    let configData: any = null;

    if (keys.length) {
      const firstKey = String(keys.shift());
      const pathJs = path.join(basePath, firstKey);
      if (!keys.length && Configure.storedData[firstKey]) {
        return Configure.storedData[firstKey];
      }
      if (env("RUNTIME", "node") == "node" && fs.existsSync(pathJs + ".js")) {
        Configure.storedData[firstKey] = require(pathJs)["default"];
      } else if (
        env("RUNTIME", "node") == "deno" &&
        fs.existsSync(pathJs + ".ts")
      ) {
        let done = false;
        let result: any = null;
        let error: any = null;

        import(pathJs)
          .then((module) => {
            result = module.default;
            done = true;
          })
          .catch((err) => {
            error = err;
            done = true;
          });

        loopWhile(() => !done);

        if (error) {
          console.error("Failed to import:", error);
        } else {
          Configure.storedData[firstKey] = result;
        }
      }
      if ((configData = Configure.storedData[firstKey])) {
        keys.forEach((key) => {
          if (!Array.isArray(configData) && typeof key === "number") {
            key = key.toString();
          }
          if (configData && configData[key]) {
            configData = configData[key];
          } else {
            configData = null;
            return;
          }
        });
      }
    }

    return configData;
  }

  static write(pathString: string, data: any): void {
    let keys: Array<string | number> = pathString.split(".").map((key) => {
      const parsed = Number(key);
      return Number.isInteger(parsed) ? parsed : key;
    });

    if (!keys.length) return;

    const firstKey: string = String(keys.shift());

    // If firstKey still doesn't exist in storedData after reading, throw an error
    if (!Configure.read(firstKey)) {
      throw new Error(
        `The key ${firstKey} does not exist in the config file or no value is set`
      );
    }

    let current = Configure.storedData[firstKey];

    // Traverse the keys
    keys.forEach((key, index) => {
      const isLastKey = index === keys.length - 1;
      const keyToUse =
        typeof key === "number" || Array.isArray(current) ? key : String(key);

      if (isLastKey) {
        // Assign the final value
        current[keyToUse] = data;
      } else {
        // Initialize the key if it doesn't exist
        if (!(keyToUse in current) || typeof current[keyToUse] !== "object") {
          current[keyToUse] = {};
        }
        current = current[keyToUse]; // Move deeper
      }
    });

    // console.log(Configure.storedData);
  }

  static init(): void {
    Configure.storedData = {};
  }
}

Configure.init();

export default Configure;
