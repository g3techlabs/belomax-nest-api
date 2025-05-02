import { Readable } from 'stream';

export abstract class MulterFileFactory {
  static fromBufferOrUint8Array<T extends Uint8Array | Buffer<ArrayBufferLike>>(
    file: T,
    fileName: string = 'peticao.docx', // Default file name
    mimeType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Default MIME type
  ): Express.Multer.File {
    const buffer = file instanceof Uint8Array ? Buffer.from(file) : file;
    return {
      fieldname: 'file',
      originalname: fileName,
      mimetype: mimeType,
      size: file.byteLength,
      buffer,
      encoding: '7bit',
      destination: '',
      filename: '',
      path: '',
      stream: Readable.from(file),
    };
  }
}
