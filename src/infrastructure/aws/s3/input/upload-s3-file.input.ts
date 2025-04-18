export interface UploadS3FileInput {
  file: Express.Multer.File['buffer'];
  name: string;
  mimeType: string;
}
