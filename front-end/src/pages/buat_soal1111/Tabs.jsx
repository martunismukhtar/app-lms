export default function Tabs({ activeTab, setActiveTab }) {
  const tabClasses = (tabName) =>
    `cursor-pointer px-6 py-3 font-medium transition-colors duration-200 ${
      activeTab === tabName
        ? "border-b-2 border-blue-600 text-blue-600"
        : "text-gray-600 hover:text-blue-600"
    }`;

  return (
    <div className="flex border-b border-gray-300 mb-6">        
      <button
        onClick={() => setActiveTab("auto")}
        className={tabClasses("auto")}
      >
        Soal Otomatis (AI)
      </button>
      <button
        onClick={() => setActiveTab("upload")}
        className={tabClasses("upload")}
      >
        Unggah dari PDF
      </button>
      <button
        onClick={() => setActiveTab("manual")}
        className={tabClasses("manual")}
      >
        Tambah Manual
      </button>
    </div>
  );
}
