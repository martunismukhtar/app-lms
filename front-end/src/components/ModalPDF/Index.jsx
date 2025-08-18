import { useContext, useEffect } from "react";
import { UserContext } from "../../context/LayoutContext";
import PDFViewer from "./Viewer";

const ModalPDF = () => {
  const { pdfurl, setOpenPDF } = useContext(UserContext);

  useEffect(() => {
    if (!pdfurl) return;
    setOpenPDF(pdfurl);
  }, [pdfurl, setOpenPDF]);

  if (!pdfurl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-900  bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] overflow-hidden transform transition-all animate-scaleIn">
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Dokumen PDF</h2>
          <button
            onClick={() => setOpenPDF(null)}
            className="cursor-pointer text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body Modal - PDF Viewer */}
        <div className="p-0 flex-1 h-full overflow-auto">
          {/* Gunakan iframe untuk menampilkan file PDF */}
          {/* <PDFViewer fileUrl={pdfurl} /> */}
          <PDFViewer 
            fileUrl={pdfurl}
            onLoadSuccess={(numPages) => console.log(`Loaded ${numPages} pages`)}
            onError={(error) => console.error('PDF Error:', error)}
            className="my-pdf-viewer"
          />
        </div>
      </div>
    </div>
  );
};

export default ModalPDF;
