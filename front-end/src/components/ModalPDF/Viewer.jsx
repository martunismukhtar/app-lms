import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Set up PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

if (import.meta.env.PROD) {
  // Production: gunakan local worker
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
} else {
  // Development: gunakan versi yang kompatibel
  pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}

const PDFViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log("Loaded with pages:", numPages);
    setNumPages(numPages);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {numPages &&
          Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={800}
              scale={1.2}
              renderTextLayer={true}
              renderAnnotationLayer={false}
            />
          ))}
      </Document>
    </div>
  );
};
export default PDFViewer;
