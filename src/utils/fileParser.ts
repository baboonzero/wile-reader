import * as pdfjsLib from 'pdfjs-dist';
import { marked } from 'marked';

// Flag to track if worker is initialized
let workerInitialized = false;

/**
 * Initialize PDF.js worker
 */
async function initPdfWorker() {
  if (workerInitialized) return;

  try {
    // Use local worker file from public directory
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    workerInitialized = true;
    console.log('PDF.js worker initialized with local worker file');
  } catch (error) {
    console.error('Failed to initialize PDF worker:', error);
    throw error;
  }
}

/**
 * Parse a PDF file and extract all text
 */
export async function parsePDF(file: File): Promise<string> {
  try {
    // Initialize worker before parsing
    await initPdfWorker();

    console.log('Starting PDF parse for:', file.name, 'Size:', file.size);

    const arrayBuffer = await file.arrayBuffer();
    console.log('ArrayBuffer loaded, size:', arrayBuffer.byteLength);

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    console.log('Loading task created');

    const pdf = await loadingTask.promise;
    console.log('PDF loaded, pages:', pdf.numPages);

    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`Processing page ${pageNum}/${pdf.numPages}`);

      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine text items with proper spacing
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      fullText += pageText + '\n\n';
    }

    console.log('PDF parsing complete, text length:', fullText.length);
    return fullText.trim();
  } catch (error) {
    console.error('Detailed PDF parsing error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    if (error instanceof Error) {
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
    throw new Error('Failed to parse PDF file. Please make sure it\'s a valid PDF.');
  }
}

/**
 * Parse a Markdown file and extract plain text
 */
export async function parseMarkdown(file: File): Promise<string> {
  try {
    const text = await file.text();

    // Configure marked to output plain text by stripping HTML
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    // Convert markdown to HTML first
    const html = await marked.parse(text);

    // Strip HTML tags to get plain text
    const plainText = html
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace HTML entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    return plainText;
  } catch (error) {
    console.error('Error parsing Markdown:', error);
    throw new Error('Failed to parse Markdown file. Please make sure it\'s a valid .md file.');
  }
}

/**
 * Validate file type
 */
export function validateFile(file: File, acceptedTypes: string[]): boolean {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  return acceptedTypes.includes(`.${fileExtension}`);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
