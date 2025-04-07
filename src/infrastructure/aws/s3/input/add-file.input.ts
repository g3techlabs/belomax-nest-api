export interface UploadFileInput {
  file: Express.Multer.File['buffer'];
  name: string;
  mimeType: string;
}
