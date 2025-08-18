import MapelSiswa from "./MapelTab";
import ExamTab from "./ExamTab";
import { useState } from "react";

const NavTab = () => {
  const [activeTab, setActiveTab] = useState("mata-pelajaran");
  const renderContent = () => {
    switch (activeTab) {
      case "mata-pelajaran":
        return <MapelSiswa />;
      case "ujian":
        return <ExamTab />;
      case "forum":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Forum Diskusi
            </h2>
            <p className="text-gray-600 mb-4">
              Forum merupakan tempat untuk berdiskusi dengan teman-teman dan
              guru.
            </p>
            <a
              href="#"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Masuk ke Forum
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("mata-pelajaran")}
          className={`cursor-pointer px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
            activeTab === "mata-pelajaran"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Mata Pelajaran
        </button>
        <button
          onClick={() => setActiveTab("ujian")}
          className={`cursor-pointer px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
            activeTab === "ujian"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Ujian
        </button>
        <button
          onClick={() => setActiveTab("forum")}
          className={`cursor-pointer px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
            activeTab === "forum"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Forum
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow p-6">{renderContent()}</div>
    </>
  );
};

export default NavTab;
