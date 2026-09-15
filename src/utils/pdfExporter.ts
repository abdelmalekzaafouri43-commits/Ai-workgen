import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Worksheet } from '../types';

/**
 * Exports a DOM node element to a PDF file and triggers standard browser download.
 */
export async function exportElementToPdf(
  elementId: string,
  filename: string = 'Worksheet.pdf',
  onProgress?: (msg: string) => void
): Promise<boolean> {
  try {
    if (onProgress) onProgress('Preparing document layout...');
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID ${elementId} not found.`);
      return false;
    }

    if (onProgress) onProgress('Rendering high-resolution PDF...');
    
    // Temporarily hide elements with .no-print class
    const noPrintElements = element.querySelectorAll('.no-print');
    const originalDisplays: string[] = [];
    noPrintElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      originalDisplays.push(htmlEl.style.display);
      htmlEl.style.display = 'none';
    });

    const canvas = await html2canvas(element, {
      scale: 2, // High clarity for print quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
    });

    // Restore hidden elements
    noPrintElements.forEach((el, index) => {
      (el as HTMLElement).style.display = originalDisplays[index];
    });

    if (onProgress) onProgress('Building multi-page PDF...');

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Handle additional pages if worksheet content exceeds single A4 page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    if (onProgress) onProgress('Saving PDF to your device...');
    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('Error generating PDF:', err);
    return false;
  }
}

/**
 * Fallback print function that handles iframe restrictions gracefully
 */
export function triggerPrintWindow(): boolean {
  try {
    window.print();
    return true;
  } catch (e) {
    console.warn('window.print blocked by iframe sandbox restriction:', e);
    return false;
  }
}
