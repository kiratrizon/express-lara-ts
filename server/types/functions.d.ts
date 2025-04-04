// functions
export {};
declare global {
  /**
   * Retrieves the value of the specified environment variable.
   * Returns `null` if the variable is not set.
   *
   * Usage:
   *   const value = env('MY_ENV_VAR');
   *
   * @param {string} key - The name of the environment variable to retrieve.
   * @returns {string | null} The value of the environment variable, or `null` if not set.
   */
  var env: (arg1: string, arg2?: any) => any;

  /**
   * Restricts an object to only the specified keys.
   * Returns a new object containing only the provided keys and their associated values.
   *
   * Usage:
   *   const filtered = only(obj, ['key1', 'key2']);
   *
   * @param {Object} source - The object to filter.
   * @param {string[]} keys - The list of keys to include in the new object.
   * @returns {Object} A new object containing only the specified keys.
   */
  var only: (source: Object, keys: string[]) => Object;

  /**
   * Converts the first character of a string to uppercase while keeping the rest unchanged.
   *
   * Usage:
   *   const result = ucFirst('example'); // 'Example'
   *
   * @param {string} str - The string to transform.
   * @returns {string} The string with the first character capitalized.
   */
  var ucFirst: (str: string) => string;

  /**
   * Calculates a future date by adding a specified number of hours to the current date.
   *
   * Usage:
   *   const futureDate = getFutureDate(5); // Returns the date 5 hours from now
   *
   * @param {number} hours - The number of hours to add to the current date.
   * @returns {string} The future date in the format `Y-m-d H:i:s`.
   */
  var getFutureDate: (hours: number) => string;

  /**
   * The base path of the application, typically the root directory.
   * This is used as the starting point for resolving all other paths.
   */
  var basePath: () => string;

  /**
   * The path to the application's resources directory, which typically contains views, translations, and other assets.
   */
  var resourcePath: () => string;

  /**
   * The path to the application's view directory, where view files (such as Blade templates) are stored.
   */
  var viewPath: () => string;

  /**
   * The path to the public directory, which is typically the web server's document root.
   * This is where publicly accessible files like images, JavaScript, and CSS are located.
   */
  var publicPath: () => string;

  /**
   * The path to the public directory, which is typically the web server's document root.
   * This is where publicly accessible files.
   */
  var uploadPath: () => string;

  /**
   * The path to the database directory, where database-related files or configurations might be stored.
   */
  var databasePath: () => string;

  /**
   * The path to the application's core directory, where the main application logic is stored.
   */
  var appPath: () => string;

  /**
   * The path to the stub directory, where template files or skeleton code files (stubs) are stored.
   */
  var stubPath: () => string;

  /**
   * Retrieves the value of a configuration option, similar to Laravel's `config` helper function.
   * Supports dot notation for nested configuration keys.
   *
   * Usage:
   *   const value = config('app.name'); // Retrieves the value of `app.name`
   *   const value = config('database.connections.mysql.host'); // Retrieves the value of a nested key
   *
   * @param {string} key - The configuration key, which can use dot notation for nested values.
   * @returns {any} The value of the configuration option, or `undefined` if the key does not exist.
   * @returns {void} Sets the value of the configuration option if an object is passed as the argument.
   */
  var config: (key: string, value?: any) => any;

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
  var log: (value: unknown, destination: string, type: string) => void;

  /**
   * Generates a table name based on the given model name.
   * Typically used to follow naming conventions for database tables.
   *
   * Usage:
   *   const tableName = generateTableNames('User'); // Generates 'users' table name
   *   const tableName = generateTableNames('Post'); // Generates 'posts' table name
   *
   * @param {string} modelName - The model name (e.g., 'User', 'Post') for which to generate the table name.
   * @returns {string} The generated table name, typically plural and in snake_case.
   */
  var generateTableNames: (modelName: string) => string;

  /**
   * Encodes a string to standard Base64.
   */
  var base64Encode: (str: string) => string;

  /**
   * Decodes a standard Base64 string to its original form.
   */
  var base64Decode: (str: string) => string;

  /**
   * Encodes a string to Base64 in a URL-safe format (Base64url).
   * Replaces `+` with `-`, `/` with `_`, and removes any trailing `=` padding.
   */
  var base64UrlEncode: (str: string) => string;

  /**
   * Decodes a URL-safe Base64 string (Base64url) to its original form.
   * Replaces `-` with `+`, `_` with `/`, and adds padding if necessary.
   */
  var base64UrlDecode: (str: string) => string;

  /**
   * This function mimics PHP's strtotime by parsing a string containing a date or time
   * and returning the corresponding Unix timestamp (in seconds). It supports relative
   * date/time formats such as "next Friday" or "3 days ago" and adjusts based on the
   * system's time zone.
   */
  var strtotime: (time: string, now?: number) => number | null;

  /**
   * This function returns the current date and time
   * in the specified format (e.g., "Y-m-d H:i:s"). If no timestamp is provided,
   * it returns the current system time formatted accordingly.
   */
  var date: (format: string, timestamp?: number) => string;

  /**
   * Checks whether a given function is defined in the current scope.
   * It returns true if the function exists, otherwise false.
   */
  var functionExists: (name: string) => boolean;

  /**
   * Checks whether a given class is defined in the current scope.
   * It returns true if the class exists, otherwise false.
   */
  var classExists: (name: string) => boolean;

  /**
   * Defines a global variable on `globalThis` with the specified name and value.
   * The variable will be writable but not configurable, meaning:
   * - It can be modified but not deleted.
   * - If the variable already exists, it cannot be redefined.
   *
   * Usage:
   *   define("myVar", 123);
   *   console.log(globalThis.myVar); // 123
   *
   * @param {string} name - The name of the global variable.
   * @param {any} value - The value to assign to the global variable.
   * @throws {Error} If the global variable already exists.
   */
  var define: (name: string, value: any) => void;

  // create description for isDefined function
  /**
   * Checks whether a given variable is defined in the current scope.
   * It returns true if the variable exists, otherwise false.
   */
  var isDefined: (name: string) => boolean;

  /** Placeholder for a function that will dump variable contents for debugging. */
  var dump: (variable: any) => void;

  /** Placeholder for a function that will dump and die, halting execution after dumping. */
  var dd: (variable: any) => void;

  /**
   * Retrieve the last element of an array.
   * If the array is empty, `null` is returned.
   */
  var end: (array: any[]) => any;

  /**
   * TMP_PATH
   */
  var TMP_PATH: string;

  /**
   * Transfer a file into a new location.
   * @param {string} filePath - The path to the file to be transferred.
   * @param {string} destination - The destination path where the file should be transferred.
   */
  var transferFile: (filePath: string, destination: string) => boolean;
}
