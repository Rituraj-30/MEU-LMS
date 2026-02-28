import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import PDFParser from 'pdf2json';

export const extractTextFromPdf = async (file: UploadedFile): Promise<string> => {
  return new Promise((resolve) => {
    const pdfParser = new (PDFParser as any)(null, 1);

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.error("PDF Parsing Error:", errData.parserError);
      resolve(""); 
    });

    pdfParser.on("pdfParser_dataReady", () => {
      const text = (pdfParser as any).getRawTextContent();
      resolve(text || "");
    });

    try {
      const dataBuffer = file.tempFilePath ? fs.readFileSync(file.tempFilePath) : file.data;
      
      if (!dataBuffer || dataBuffer.length === 0) {
        console.log("No data buffer found for PDF");
        return resolve("");
      }

      pdfParser.parseBuffer(dataBuffer);
    } catch (error) {
      console.error("Extraction logic failed:", error);
      resolve("");
    }
  });
};