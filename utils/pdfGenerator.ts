
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const downloadAsPdf = async (elementId: string, fileName: string) => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  // Hide scrollbars during capture
  const originalStyle = input.style.overflow;
  input.style.overflow = 'visible';

  try {
    const canvas = await html2canvas(input, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    // Restore original style
    input.style.overflow = originalStyle;
  }
};
