// /* eslint-disable */

// import { TermCoordinates } from '../dtos/term-coordinates';
// import { CreateDocumentService } from '../../document/services/create-document.service';
// import { Injectable } from '@nestjs/common';
// import { Color, PDFDocument, PDFPage, rgb } from 'pdf-lib';
// // MUDANÇA 1: Remova o import estático que causa o erro.
// // import { getDocument, PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';

// // MUDANÇA 2: Importe APENAS OS TIPOS. Isso não gera código JS e serve só para o TypeScript.
// import type { PDFDocumentProxy, TextItem } from 'pdfjs-dist/types/src/display/api';
// import { HighlightPdfTermInput } from '../inputs/highlight-pdf-term.input';
// import { MulterFileFactory } from 'src/utils/multer-file-factory';

// @Injectable()
// export class OLDHighlightPdfTermService {
//   private pdfForSearch: PDFDocumentProxy;
//   private pdfForHighlight: PDFDocument;
//   private highlightColor: Color = rgb(1, 1, 0);
//   private highlightOpacity: number = 0.5;

//   constructor(private readonly createDocumentService: CreateDocumentService) {}

//   async execute({ automationId, file, term, customerName, bank }: HighlightPdfTermInput) {
//     // * pdf-lib modifies the pdf highlighting the terms, pdfjs-dist gets its content and searchs the terms

//     try {
//       await this.loadDocuments(Buffer.from(file.buffer));

//       const pages = this.getPages();

//       const termsToHighlight = await this.findToHighlight(term);

//       this.applyHighlights(pages, termsToHighlight);

//       const highlightedDocument = await this.pdfForHighlight.save();
//       const multerFile = this.convertToMulterFile(highlightedDocument);

//       return await this.createDocumentService.execute({
//         name: `DESTACADO-${term}-${bank}-${customerName}`,
//         automationId,
//         file: multerFile,
//       });
//     } catch (error) {
//       console.error('Error highlighting PDF terms:', error);
//       throw new Error('Failed to highlight PDF terms');
//     }
//   }

//   private async loadDocuments(buffer: Buffer) {
//     const pdfData = new Uint8Array(buffer);

//     // MUDANÇA 3: Carregue dinamicamente o módulo 'pdfjs-dist' aqui.
//     const { getDocument, GlobalWorkerOptions } = await import(
//       // 'pdfjs-dist/legacy/build/pdf.mjs',
//       ''
//     );

//     // Configura o worker, essencial para 'pdfjs-dist' rodar em ambiente Node.js
//     GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.js';

//     const pdfForHighlight = await PDFDocument.load(pdfData);
//     // Agora use a função 'getDocument' que acabamos de carregar.
//     const pdfFoSearch = await getDocument({ data: pdfData }).promise;

//     this.pdfForHighlight = pdfForHighlight;
//     this.pdfForSearch = pdfFoSearch;
//   }

//   private getPages() {
//     return this.pdfForHighlight.getPages();
//   }

//   private async findToHighlight(term: string) {
//     const termsToHighlight: {
//       pageIndex: number;
//       coordinates: TermCoordinates;
//     }[] = [];
//     const numberOfPages = this.pdfForSearch.numPages;

//     for (let i = 0; i < numberOfPages; i++) {
//       const page = await this.pdfForSearch.getPage(i + 1);
//       const pageTextContent = await page.getTextContent();
//       const textItems = pageTextContent.items as TextItem[];

//       textItems.forEach((textItem) => {
//         if (textItem.str.toLowerCase().includes(term.toLowerCase())) {
//           const coordinates = this.getTermCoordinates(textItem);
//           termsToHighlight.push({ pageIndex: i, coordinates });
//         }
//       });
//     }

//     return termsToHighlight;
//   }

//   private getTermCoordinates(textItem: TextItem): TermCoordinates {
//     return {
//       x: textItem.transform[4],
//       y: textItem.transform[5],
//       width: textItem.width,
//       height: textItem.height,
//     };
//   }

//   private applyHighlights(
//     pages: PDFPage[],
//     highlights: { pageIndex: number; coordinates: TermCoordinates }[],
//   ) {
//     highlights.forEach(({ pageIndex, coordinates }) => {
//       const page = pages[pageIndex];
//       this.highlightTerm(page, coordinates);
//     });
//   }

//   private highlightTerm(page: PDFPage, coordinates: TermCoordinates) {
//     page.drawRectangle({
//       ...coordinates,
//       color: this.highlightColor,
//       opacity: this.highlightOpacity,
//     });
//   }

//   private convertToMulterFile(file: Uint8Array): Express.Multer.File {
//     const multerFile = MulterFileFactory.fromBufferOrUint8Array(
//       file,
//       'arquivo.pdf',
//       'application/pdf',
//     );
//     return multerFile;
//   }
// }
