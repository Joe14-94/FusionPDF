import { PDFDocument } from 'pdf-lib';
import { PdfFile } from '../types';

export const mergePdfs = async (files: PdfFile[]): Promise<Blob> => {
  try {
    const mergedPdf = await PDFDocument.create();

    for (const pdfFile of files) {
      const fileBuffer = await pdfFile.file.arrayBuffer();
      // Load the source PDF
      const pdf = await PDFDocument.load(fileBuffer);
      // Copy all pages from the source PDF
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      // Add each copied page to the merged PDF
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await mergedPdf.save();
    
    // Create a Blob from the bytes
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error("Error merging PDFs:", error);
    throw new Error("Impossible de fusionner les fichiers. Assurez-vous qu'ils sont valides.");
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};