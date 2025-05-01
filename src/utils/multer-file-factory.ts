import { Readable } from 'stream';

export abstract class MulterFileFactory {
  static fromBufferOrUint8Array<T extends Uint8Array | Buffer<ArrayBufferLike>>(
    file: T,
  ): Express.Multer.File {
    const buffer = file instanceof Uint8Array ? Buffer.from(file) : file;
    return {
      fieldname: 'file',
      originalname: 'arquivo.pdf',
      mimetype: 'application/pdf',
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
