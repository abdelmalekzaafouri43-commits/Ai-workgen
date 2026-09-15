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
      onclone: (clonedDoc) => {
        // 1. Sanitize <style> blocks in the cloned document to remove unsupported modern CSS syntax like oklch()
        const styleEls = clonedDoc.querySelectorAll('style');
        styleEls.forEach((style) => {
          if (style.textContent && (style.textContent.includes('oklch') || style.textContent.includes('color-mix'))) {
            style.textContent = style.textContent
              .replace(/oklch\([^)]+\)/gi, '#0284c7')
              .replace(/color-mix\([^)]+\)/gi, '#0f172a');
          }
        });

        // 2. Clean inline styles containing oklch
        const elementsWithInlineStyle = clonedDoc.querySelectorAll('[style*="oklch"]');
        elementsWithInlineStyle.forEach((el) => {
          const styleAttr = el.getAttribute('style') || '';
          el.setAttribute('style', styleAttr.replace(/oklch\([^)]+\)/gi, '#0284c7'));
        });

        // 3. Map computed RGB styles from original live DOM onto cloned elements for accurate rendering
        const origNodes = [element, ...Array.from(element.querySelectorAll('*'))] as HTMLElement[];
        const clonedRoot = clonedDoc.getElementById(elementId);
        if (clonedRoot) {
          const clonedNodes = [clonedRoot, ...Array.from(clonedRoot.querySelectorAll('*'))] as HTMLElement[];
          for (let i = 0; i < origNodes.length && i < clonedNodes.length; i++) {
            const orig = origNodes[i];
            const cloned = clonedNodes[i];
            if (orig && cloned) {
              try {
                const cs = window.getComputedStyle(orig);
                if (cs.color && !cs.color.includes('oklch')) {
                  cloned.style.color = cs.color;
                }
                if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && !cs.backgroundColor.includes('oklch')) {
                  cloned.style.backgroundColor = cs.backgroundColor;
                }
                if (cs.borderColor && !cs.borderColor.includes('oklch')) {
                  cloned.style.borderColor = cs.borderColor;
                }
              } catch (_) {
                // Ignore individual style read errors
              }
            }
          }
        }
      },
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
