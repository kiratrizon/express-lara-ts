import { Request, Response, NextFunction } from "express";

export interface IFileHandler {
  // Static methods to handle file uploads
  #multer(): any; // Returns a Multer upload handler (can be of any type depending on your setup)
  #busboy(): (req: Request, res: Response, next: NextFunction) => void; // Busboy handler function
  useBusboy(): void; // Method to configure or enable Busboy
  getFileHandler(): any; // Returns the file handler (Multer or Busboy)
}

export interface IFile {
  originalname: string;
  mimetype: string;
  tmp_name: String;
  size: number;
  error: number;
  message?: string;
}
