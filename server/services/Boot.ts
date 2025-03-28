import FileHandler from "../http/FileHandler";

class Boot {
  static start() {
    FileHandler.useBusboy();
  }
}

export default Boot;
