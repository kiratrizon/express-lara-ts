// variables
export {};
declare global {
  /**
   * Represents the POST data sent to the server in an HTTP request. This object
   * can be used to access form data or other data submitted via HTTP POST method.
   */
  var POST: Record<string, any>;

  /**
   * Represents the GET data sent to the server in an HTTP request. This object
   * can be used to access query string parameters or other data submitted via
   * the HTTP GET method.
   */
  var GET: Record<string, any>;

  /**
   * Represents the FILES data sent to the server in an HTTP request. This array
   * can be used to access uploaded files via the HTTP POST method.
   */
  var FILES: Record<string, any>;

  /**
   * Represents the session data for the current user. This object can be used to
   * store user-specific data that persists across multiple requests.
   */
  var SESSION: Record<string, any>;

  /**
   * Represents the cookies sent to the server in an HTTP request. This object
   * can be used to access cookies sent by the client.
   */
  var COOKIE: Record<string, any>;

  /**
   * Represents the request object sent to the server in an HTTP request. This object
   * can be used to access the HTTP request headers, body, and other data.
   */
  var REQUEST: Record<string, any>;

  /**
   * Method type of the HTTP request (GET, POST, PUT, DELETE, etc.).
   */
  var METHOD: string;
}
