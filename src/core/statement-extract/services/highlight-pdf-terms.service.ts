/* eslint-disable */

import { TermCoordinates } from '../dtos/term-coordinates';
import { CreateDocumentService } from '../../document/services/create-document.service';
import { Injectable } from '@nestjs/common';
import { Color, PDFDocument, PDFPage, rgb } from 'pdf-lib';
import { getDocument, PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { HighlightPdfTermsInput } from '../inputs/highlight-pdf-terms.input';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { Readable } from 'node:stream';

@Injectable()
export class HighlightPdfTermsService {
  private pdfForSearch: PDFDocumentProxy;
  private pdfForHighlight: PDFDocument;
  private highlightColor: Color = rgb(1, 1, 0);
  private highlightOpacity: number = 0.5;

  constructor(private readonly createDocumentService: CreateDocumentService) {}

  async execute({ automationId, file, terms }: HighlightPdfTermsInput) {
    // * pdf-lib modifies the pdf highlighting the terms, pdfjs-dist gets its content and searchs the terms

    try {
      await this.loadDocuments(file.buffer);

      const pages = this.getPages();

      const termsToHighlight = await this.findToHighlight(terms);

      this.applyHighlights(pages, termsToHighlight);

      const highlightedDocument = await this.pdfForHighlight.save();
      const multerFile = this.convertToMulterFile(highlightedDocument);

      return await this.createDocumentService.execute({
        name: 'DESTACADO',
        automationId,
        file: multerFile,
      });
    } catch (error) {
      console.error('Error highlighting PDF terms:', error);
      throw new Error('Failed to highlight PDF terms');
    }
  }

  private async loadDocuments(buffer: ArrayBufferLike) {
    console.log('buffer', buffer);
    
    const pdfForHighlight = await PDFDocument.load(buffer);
    const pdfFoSearch = await getDocument({ data: buffer }).promise;
    this.pdfForHighlight = pdfForHighlight;
    this.pdfForSearch = pdfFoSearch;
  }

  private getPages() {
    return this.pdfForHighlight.getPages();
  }

  private async findToHighlight(terms: string[]) {
    const termsToHighlight: {
      pageIndex: number;
      coordinates: TermCoordinates;
    }[] = [];
    const numberOfPages = this.pdfForSearch.numPages;

    for (let i = 0; i < numberOfPages; i++) {
      const page = await this.pdfForSearch.getPage(i + 1);
      const pageTextContent = await page.getTextContent();
      const textItems = pageTextContent.items as TextItem[];

      textItems.forEach((textItem) => {
        terms.forEach((term) => {
          if (textItem.str.toLowerCase().includes(term.toLowerCase())) {
            const coordinates = this.getTermCoordinates(textItem);
            termsToHighlight.push({ pageIndex: i, coordinates });
          }
        });
      });
    }

    return termsToHighlight;
  }

  private getTermCoordinates(textItem: TextItem): TermCoordinates {
    return {
      x: textItem.transform[4],
      y: textItem.transform[5],
      width: textItem.width,
      height: textItem.height,
    };
  }

  private applyHighlights(
    pages: PDFPage[],
    highlights: { pageIndex: number; coordinates: TermCoordinates }[],
  ) {
    highlights.forEach(({ pageIndex, coordinates }) => {
      const page = pages[pageIndex];
      this.highlightTerm(page, coordinates);
    });
  }

  private highlightTerm(page: PDFPage, coordinates: TermCoordinates) {
    page.drawRectangle({
      ...coordinates,
      color: this.highlightColor,
      opacity: this.highlightOpacity,
    });
  }

  private convertToMulterFile(file: Uint8Array): Express.Multer.File {
    const buffer = Buffer.from(file);
    return {
      fieldname: 'file',
      originalname: 'arquivo-destacado.pdf',
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

// for (let j = 0; j < items.length; j++) {
//   const item: any = items[j];

//   if (
//     typeof item.str === 'string' &&
//     item.str.toLowerCase().includes(terms.toLowerCase())
//   ) {
//     const transform = item.transform;
//     const x = transform[4];
//     const y = transform[5];
//     const width = item.width;
//     const height = item.height;

//     const pdfLibPage = pages[i];

//     pdfLibPage.drawRectangle({
//       x,
//       y,
//       width,
//       height,
//       color: rgb(1, 1, 0),
//       opacity: 0.5,
//     });
//   }
// }
