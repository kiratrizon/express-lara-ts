import "../services/functions";
import "../services/variables";
import express, { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the 'files' property
import morgan from "morgan";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import cors from "cors";
import helmet from "helmet";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import renderData from "../services/DD";
import FileHandler from "./FileHandler";
import Boot from "../services/Boot";
import { IFile } from "../kiratrizon/interfaces";

class Server {
  static express = express;
  static app = express(); // Correct initialization
  static router: express.Router = express.Router();
  private static baseUrl: string = "";
  private static routes: Record<string, any> = {};

  static boot() {
    Boot.start();
    Server.app.use(morgan("dev"));
    Server.app.use(Server.express.json());
    Server.app.use(Server.express.urlencoded({ extended: true }));
    Server.app.use(
      Server.express.static(path.join(__dirname, "..", "..", "public"))
    );
    const handle: Record<string, any> = Server.handle();
    const appEssentials: string[] = [
      "session",
      "cors",
      "cookieParser",
      "flash",
      "helmet",
      "fileHandler",
    ];

    // fileFinalHandler
    appEssentials.push("finalFileHandler");
    appEssentials.forEach((key) => {
      Server.app.use(handle[key]);
    });
    // init view engine
    Server.app.set("view engine", "ejs");
    Server.app.set("views", viewPath());

    // request/response handling
    Server.app.use((req: Request, res: Response, next: NextFunction) => {
      // set global variables
      METHOD = req.method.toUpperCase();
      POST = req.body || {};
      GET = req.query || {};
      FILES = req.files || {};
      REQUEST = {
        method: METHOD,
        params: req.params,
        headers: req.headers,
        body: req.body,
        query: req.query,
        cookies: req.cookies,
        path: req.path,
        originalUrl: req.originalUrl,
        ip: req.ip,
        protocol: req.protocol,
      };

      // next
      next();
    });

    Server.app.post("/upload", (req: Request, res: Response) => {
      if ("hello" in FILES) {
        const fileObj: IFile = FILES["hello"];
        const fileName: string = `random_${Math.floor(
          Math.random() * 1000000
        )}.${fileObj["originalname"].split(".").pop()}`;
        const pathToSave: string = path.join(uploadPath(), "images", fileName);
        const tpmPath: string = fileObj["tmp_name"];

        if (transferFile(tpmPath, pathToSave)) {
          res.status(200).json({
            message: "File uploaded successfully.",
            filePath: pathToSave,
          });
          return;
        }
      }

      // If file isn't found in FILES, return this response
      res.status(400).json({ message: "File upload failed." });
    });
  }

  private static handle() {
    let redisClient = createClient(config("app.redis"));
    redisClient.connect().catch(console.error);

    // Initialize store.
    let redisStore = new RedisStore({
      client: redisClient,
      prefix: "myreact:",
      ttl: 315576000 * 60,
    });
    const sessionObj = {
      store: redisStore,
      secret: process.env.MAIN_KEY || "secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 60,
      },
    };
    const origins = config("origins.origins").length
      ? config("origins.origins")
      : "*";
    const corsOptions = {
      origin: origins,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      optionsSuccessStatus: 200,
    };
    return {
      cookieParser: cookieParser(),
      session: session(sessionObj),
      flash: flash(),
      cors: cors(corsOptions),
      helmet: helmet(),
      fileHandler: FileHandler.getFileHandler(),
      finalFileHandler: FileHandler.handleFiles,
    };
  }
}

Server.boot();

const app = Server.app;

export default app;
