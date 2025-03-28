import multer from "multer";
import Busboy from "busboy";
import { Request, Response, NextFunction } from "express";
import { IFile, IFileHandler } from "../kiratrizon/interfaces";
import { staticImplements } from "../kiratrizon/interfaces/static";
import fs from "fs";

interface CustomMulterFile extends Express.Multer.File {
  tmp_name?: string;
}

@staticImplements<IFileHandler>()
class FileHandler {
  private static filePath: string = TMP_PATH;
  private static multer() {
    FileHandler.validatePath();
    const storage = multer.diskStorage({
      destination: (req, file: CustomMulterFile, cb) => {
        cb(null, FileHandler.filePath);
      },
      filename: (req, file: CustomMulterFile, cb) => {
        const randomString = Math.random().toString(36).substring(2, 7);
        const sanitizedFilename = FileHandler.fileSpaceCharsDevoid(
          `${date("Y-m-d-H-i-s")}-${randomString}-${file.originalname}`
        );
        const saveTo = `${FileHandler.filePath}/${sanitizedFilename}`;
        file["tmp_name"] = saveTo;
        cb(null, sanitizedFilename);
      },
    });
    const upload = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
        cb(null, true); // Accept all files (add validation here if needed)
      },
    }).any();

    return (req: Request, res: Response, next: NextFunction) => {
      upload(req, res, (err) => {
        if (err) {
          (req as any).files = [{ error: 1, message: err.message }]; // Error state
        } else {
          (req as any).files =
            (req as any).files?.map((file: any) => ({
              ...file,
              error: 0, // No error
            })) || [];
        }
        next();
      });
    };
  }

  private static busboy() {
    FileHandler.validatePath();

    return (req: Request, res: Response, next: NextFunction) => {
      const allowedRequestMethods = ["POST", "PUT"];
      if (!allowedRequestMethods.includes(req.method)) {
        return next(); // Skip non-POST/PUT requests
      }

      const contentType = req.headers["content-type"] || "";
      if (!contentType.startsWith("multipart/form-data")) {
        return next(); // Skip if it's not a file upload request
      }

      const busboy = Busboy({ headers: req.headers });
      const files: any[] = [];

      busboy.on(
        "file",
        (fieldname: string, file: NodeJS.ReadableStream, filename: any) => {
          let fileSize = 0;
          let hasError = false;

          // Maintain your logic for extracting file details
          const arrangeFile: Record<string, any> = {};
          let originalname: string = "";
          if (typeof filename === "object") {
            const keys: string[] = Object.keys(filename);
            keys.forEach((key) => {
              if (key === "filename") {
                originalname = filename[key];
              } else if (key === "mimeType") {
                arrangeFile["mimetype"] = filename[key];
              } else {
                arrangeFile[key] = filename[key];
              }
            });
          } else {
            originalname = filename;
          }

          // Generate safe filename
          const randomString = Math.random().toString(36).substring(2, 7);
          const sanitizedFilename = FileHandler.fileSpaceCharsDevoid(
            `${date("Y-m-d-H-i-s")}-${randomString}-${originalname}`
          );
          const saveTo = `${FileHandler.filePath}/${sanitizedFilename}`;
          const writeStream = fs.createWriteStream(saveTo);

          // Stream the file to disk
          file.pipe(writeStream);

          // Track file size
          file.on("data", (chunk: Buffer) => {
            fileSize += chunk.length;
          });

          // Handle errors
          file.on("error", (err) => {
            hasError = true;
            files.push({
              fieldname,
              originalname,
              ...arrangeFile,
              tmp_name: saveTo,
              error: 1,
              message: err.message,
            });
          });

          file.on("end", () => {
            if (!hasError) {
              files.push({
                fieldname,
                originalname,
                ...arrangeFile,
                tmp_name: saveTo,
                size: fileSize,
                error: 0,
              });
            }
          });
        }
      );

      busboy.on("finish", () => {
        (req as any).files = files.length > 0 ? files : null;
        next();
      });

      req.pipe(busboy);
    };
  }

  public static useBusboy() {
    config("file_handler.use", "busboy");
  }

  public static getFileHandler() {
    const handler: string | null = config("file_handler.use") || null;
    if (handler && handler === "busboy") {
      return FileHandler.busboy();
    }
    // use multer by default
    return FileHandler.multer();
  }

  // after handling
  public static handleFiles(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const newData: Record<string, any> = {};
    if (req.files) {
      const files = req.files as any[];
      files.forEach((file) => {
        const {
          fieldname,
          originalname,
          mimetype,
          tmp_name,
          size,
          error = 0,
          message = "",
        } = file;
        const fileData: IFile = {
          originalname,
          mimetype,
          tmp_name,
          size,
          error,
          message,
        };
        newData[fieldname] = fileData;
      });
    }
    req.files = newData;
    next();
  }

  private static validatePath() {
    if (!fs.existsSync(FileHandler.filePath)) {
      fs.mkdirSync(FileHandler.filePath, { recursive: true });
    }
  }

  private static fileSpaceCharsDevoid(name: string): string {
    return name.replace(/\s/g, "_");
  }
}

export default FileHandler;
