import { useState } from "react";

const TabSoal = () => {
  const [activeTab, setActiveTab] = useState("auto");
  const [questions, setQuestions] = useState([]);
  const [manualQuestion, setManualQuestion] = useState("");
  const [manualAnswer, setManualAnswer] = useState("");

  const generateAIQuestion = () => {
    const subjects = ["Matematika", "Sains", "Bahasa Indonesia", "Sejarah"];
    const difficulties = ["Mudah", "Sedang", "Sulit"];
    const questionTypes = [
      "Pilihan Ganda",
      "Esai",
      "Benar/Salah",
      "Isian Singkat",
    ];

    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const difficulty =
      difficulties[Math.floor(Math.random() * difficulties.length)];
    const type =
      questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const questionText = `Contoh soal ${type} tentang ${subject} tingkat ${difficulty}.`;
    const answer = `Jawaban untuk soal: ${questionText}`;

    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        text: questionText,
        answer: answer,
        type: type,
        source: "AI",
      },
    ]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      // Simulate reading PDF content and extracting questions
      setTimeout(() => {
        alert(`Berhasil mengunggah file: ${file.name}`);
        setQuestions([
          ...questions,
          {
            id: questions.length + 1,
            text: `Soal dari file PDF: ${file.name}`,
            answer: "Jawaban tersedia dalam dokumen PDF.",
            type: "PDF",
            source: "PDF",
          },
        ]);
      }, 1000);
    } else {
      alert("Silakan unggah file PDF yang valid.");
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualQuestion.trim() || !manualAnswer.trim()) return;

    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        text: manualQuestion,
        answer: manualAnswer,
        type: "Manual",
        source: "Manual",
      },
    ]);

    setManualQuestion("");
    setManualAnswer("");
  };

  return (
    <>
      <div className="flex border-b border-gray-300 mb-6">
        <button
          onClick={() => setActiveTab("auto")}
          className={`px-6 py-3 font-medium transition-colors duration-200 ${
            activeTab === "auto"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Soal Otomatis (AI)
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-6 py-3 font-medium transition-colors duration-200 ${
            activeTab === "upload"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Unggah dari PDF
        </button>
        <button
          onClick={() => setActiveTab("manual")}
          className={`px-6 py-3 font-medium transition-colors duration-200 ${
            activeTab === "manual"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Tambah Manual
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        {activeTab === "auto" && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Hasilkan Soal Otomatis dengan AI
            </h2>
            <p className="text-gray-600 mb-6">
              Klik tombol di bawah untuk membuat soal acak menggunakan
              kecerdasan buatan.
            </p>
            <button
              onClick={generateAIQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Generate Soal Baru
            </button>
          </div>
        )}

        {activeTab === "upload" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Unggah Soal dari File PDF
            </h2>
            <p className="text-gray-600 mb-4">
              Silakan pilih file PDF yang ingin Anda impor soalnya.
            </p>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        )}

        {activeTab === "manual" && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Tambahkan Soal Secara Manual
            </h2>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Soal
              </label>
              <textarea
                value={manualQuestion}
                onChange={(e) => setManualQuestion(e.target.value)}
                placeholder="Masukkan pertanyaan di sini..."
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Jawaban
              </label>
              <textarea
                value={manualAnswer}
                onChange={(e) => setManualAnswer(e.target.value)}
                placeholder="Masukkan jawaban yang benar..."
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Simpan Soal
            </button>
          </form>
        )}
      </div>
    </>
  );
};
export default TabSoal;
