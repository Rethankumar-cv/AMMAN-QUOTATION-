import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Professional PDF Engine (Phase 4)
 * Generates a native PDF directly from the Preview DOM Element.
 * This guarantees "Single Source of Truth" - the Preview IS the template, avoiding duplicate logic.
 * 
 * @param {HTMLElement} elementRef - The DOM node containing the A4 Preview
 * @returns {jsPDF} The generated jsPDF instance, ready for export or preview.
 */
export const generateQuotationPDF = async (elementRef) => {
  if (!elementRef) throw new Error("Document reference not provided to PDF Engine");

  // 1. Capture the DOM element as a high-resolution canvas
  // scale: 2 ensures text remains crisp and readable when zooming the PDF
  const canvas = await html2canvas(elementRef, {
    scale: 2, 
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 794,
    width: 794,
    onclone: (document, element) => {
      // Ensure the cloned element removes any CSS scaling that was applied for mobile preview
      element.style.transform = 'none';
      element.style.width = '794px';
      // Force all descendant tables and blocks to respect the rigid width
      const tables = element.querySelectorAll('table');
      tables.forEach(t => t.style.width = '100%');
    }
  });

  const imgData = canvas.toDataURL('image/jpeg', 1.0);
  
  // 2. Initialize PDF in A4 format, portrait mode, millimeters
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  
  // Calculate proportionate height based on the canvas aspect ratio
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
  let heightLeft = pdfHeight;
  let position = 0;

  // 3. Render the first page
  pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
  heightLeft -= pdf.internal.pageSize.getHeight();

  // 4. Handle multi-page expansion seamlessly
  // If the content (e.g. Terms & Conditions) pushes the layout beyond A4 height, slice it to page 2+
  while (heightLeft >= 0) {
    position = heightLeft - pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();
  }

  // Returning the built engine instance without triggering download yet.
  return pdf;
};
