import React, { useState, useCallback, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

// PDF.js options - definisikan di luar komponen untuk mencegah re-render
const PDF_OPTIONS = {
  cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
};

// Production-ready worker configuration
const setupPDFWorker = () => {
  // Periksa apakah worker sudah di-set
  if (pdfjs.GlobalWorkerOptions.workerSrc) {
    return;
  }

  // Untuk environment yang mendukung import.meta.env (Vite)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.PROD) {
      // Production: gunakan local worker
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    } else {
      // Development: gunakan versi yang kompatibel
      pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    }
  } 
  // Fallback untuk environment lain
  else {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  }
};

// Initialize worker
setupPDFWorker();

const PDFViewer = ({ fileUrl, className = '', onError, onLoadSuccess }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1.0);

  // Memoized file URL untuk mencegah re-render yang tidak perlu
  const memoizedFileUrl = useMemo(() => fileUrl, [fileUrl]);

  // Handle document load success
  const handleDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
    
    if (onLoadSuccess) {
      onLoadSuccess(numPages);
    }
  }, [onLoadSuccess]);

  // Handle document load error
  const handleDocumentLoadError = useCallback((error) => {
    console.error('PDF load error:', error);
    setError(`Failed to load PDF: ${error.message}`);
    setLoading(false);
    
    if (onError) {
      onError(error);
    }
  }, [onError]);

  // Handle page load start
  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  // Navigation handlers
  const goToPreviousPage = useCallback(() => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  }, [numPages]);

  const goToPage = useCallback((page) => {
    const pageNum = parseInt(page, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= (numPages || 1)) {
      setPageNumber(pageNum);
    }
  }, [numPages]);

  // Zoom handlers
  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1.0);
  }, []);

  // Render loading state
  const renderLoading = useCallback(() => (
    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
      <Loader2 className="animate-spin mr-2" size={20} />
      <span className="text-gray-600">Loading PDF...</span>
    </div>
  ), []);

  // Render error state
  const renderError = useCallback(() => (
    <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="text-red-500 mr-2" size={20} />
      <div>
        <p className="text-red-700 font-medium">Error loading PDF</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    </div>
  ), [error]);

  // Input validation
  if (!fileUrl) {
    return (
      <div className="flex items-center justify-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="text-yellow-500 mr-2" size={20} />
        <span className="text-yellow-700">No PDF file URL provided</span>
      </div>
    );
  }

  return (
    <div className={`pdf-viewer ${className}`}>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-100 rounded-t-lg">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1 || loading}
            className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={numPages || 1}
              value={pageNumber}
              onChange={(e) => goToPage(e.target.value)}
              className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <span className="text-gray-600">
              of {numPages || '—'}
            </span>
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1) || loading}
            className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={loading}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-sm transition-colors"
          >
            −
          </button>
          <span className="px-2 py-1 bg-white border border-gray-300 rounded text-sm min-w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={loading}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-sm transition-colors"
          >
            +
          </button>
          <button
            onClick={resetZoom}
            disabled={loading}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 text-sm transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="border border-gray-300 rounded-b-lg overflow-hidden bg-gray-50">
        {error ? (
          renderError()
        ) : (
          <div className="flex justify-center p-4">
            <div className="bg-white shadow-lg">
              <Document
                file={memoizedFileUrl}
                onLoadSuccess={handleDocumentLoadSuccess}
                onLoadError={handleDocumentLoadError}
                onLoadStart={handleLoadStart}
                loading={renderLoading()}
                error={renderError()}
                options={PDF_OPTIONS}
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={renderLoading()}
                  error={renderError()}
                />
              </Document>
            </div>
          </div>
        )}
      </div>

      {/* Document info */}
      {numPages && (
        <div className="mt-2 text-sm text-gray-600 text-center">
          Document loaded successfully • {numPages} pages • Scale: {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  );
};

export default PDFViewer;