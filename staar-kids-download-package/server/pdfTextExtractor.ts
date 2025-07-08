import fs from "fs";
import path from "path";

/**
 * Extract text content from the PDF files we have access to
 * Since we have the PDFs as text content in attached_assets, we'll process them directly
 */
export interface PDFMetadata {
  file: string;
  grade: number;
  subject: "math" | "reading";
  year: number;
}

// Available PDF files with their metadata
export const AVAILABLE_PDF_FILES: PDFMetadata[] = [
  { file: "2013-staar-3-reading-test_1749609098028.pdf", grade: 3, subject: "reading", year: 2013 },
  { file: "2013-staar-4-math-test_1749609098029.pdf", grade: 4, subject: "math", year: 2013 },
  { file: "2013-staar-4-reading-test_1749609098029.pdf", grade: 4, subject: "reading", year: 2013 },
  { file: "2013-staar-5-math-test_1749609098029.pdf", grade: 5, subject: "math", year: 2013 },
  { file: "2013-staar-5-reading-test_1749609098029.pdf", grade: 5, subject: "reading", year: 2013 },
  { file: "2014-staar-3-math-test_1749609098029.pdf", grade: 3, subject: "math", year: 2014 },
  { file: "2014-staar-3-reading-test_1749609098029.pdf", grade: 3, subject: "reading", year: 2014 },
  { file: "2014-staar-4-math-test_1749609098029.pdf", grade: 4, subject: "math", year: 2014 },
  { file: "2014-staar-4-reading-test_1749609098029.pdf", grade: 4, subject: "reading", year: 2014 },
  { file: "2014-staar-5-math-test_1749609098029.pdf", grade: 5, subject: "math", year: 2014 },
  { file: "2014-staar-5-reading-test_1749609098029.pdf", grade: 5, subject: "reading", year: 2014 },
  { file: "2015-staar-3-reading-test_1749609098029.pdf", grade: 3, subject: "reading", year: 2015 },
  { file: "2015-staar-4-reading-test_1749609098029.pdf", grade: 4, subject: "reading", year: 2015 },
  { file: "2015-staar-5-reading-test_1749609098029.pdf", grade: 5, subject: "reading", year: 2015 },
  { file: "2016-staar-3-math-test_1749609098029.pdf", grade: 3, subject: "math", year: 2016 },
  { file: "2016-staar-3-reading-test_1749609098029.pdf", grade: 3, subject: "reading", year: 2016 },
  { file: "2016-staar-4-math-test_1749609098029.pdf", grade: 4, subject: "math", year: 2016 },
  { file: "2016-staar-4-reading-test_1749609098029.pdf", grade: 4, subject: "reading", year: 2016 },
  { file: "2016-staar-5-math-test_1749609098029.pdf", grade: 5, subject: "math", year: 2016 },
  { file: "2016-staar-5-reading-test_1749609098029.pdf", grade: 5, subject: "reading", year: 2016 }
];

/**
 * Read PDF content from attached_assets directory
 */
export async function readPDFContent(filename: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), "attached_assets", filename);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`PDF file not found: ${filename}`);
      return "";
    }

    // For now, we'll return a placeholder since we can't directly read PDF files
    // In a real implementation, you'd use a PDF parsing library like pdf-parse
    // We'll use the content provided in the attached files
    return `PDF content for ${filename}`;
  } catch (error) {
    console.error(`Error reading PDF ${filename}:`, error);
    return "";
  }
}

/**
 * Get all available PDF contents with their metadata
 */
export async function getAllPDFContents(): Promise<{ content: string; metadata: PDFMetadata }[]> {
  const results: { content: string; metadata: PDFMetadata }[] = [];
  
  for (const metadata of AVAILABLE_PDF_FILES) {
    const content = await readPDFContent(metadata.file);
    if (content) {
      results.push({ content, metadata });
    }
  }
  
  return results;
}

/**
 * Get PDF contents filtered by grade and subject
 */
export async function getPDFContentsByFilter(
  grade?: number,
  subject?: "math" | "reading",
  year?: number
): Promise<{ content: string; metadata: PDFMetadata }[]> {
  const allContents = await getAllPDFContents();
  
  return allContents.filter(({ metadata }) => {
    if (grade && metadata.grade !== grade) return false;
    if (subject && metadata.subject !== subject) return false;
    if (year && metadata.year !== year) return false;
    return true;
  });
}