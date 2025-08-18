import React from "react";
import useFormIkutUjian from "./useForm";
import SelesaiUjian from "./SelesaiUjian";

const DaftarSoalUjian = ({ data, id_ujian }) => {
  const {
    questions,
    currentQuestionIndex,
    currentQuestion,
    answers,
    timeLeft,
    formatTime,
    handlePrev,
    handleNext,
    handleAnswerChange,
    handleSubmitExam,
    isLoading,
    selesai,
    hasil
  } = useFormIkutUjian(data, id_ujian);

  if (!currentQuestion) return <p>Memuat soal...</p>;

  if(selesai){
    return <SelesaiUjian data={hasil} />
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-indigo-700">
            Ujian Online Siswa
          </h1>
          <div className="text-lg font-mono text-red-500 bg-red-100 px-4 py-1 rounded-full">
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">
              Soal {currentQuestionIndex + 1} dari {questions.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <label
                key={option}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  answers[currentQuestionIndex] === option
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-300"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={answers[currentQuestionIndex].jawaban === option}
                  onChange={() => handleAnswerChange(option, currentQuestion.id)}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-3 text-gray-700">
                  {option}. {currentQuestion.pilihan[option]}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className={`cursor-pointer px-4 py-2 rounded-md font-medium transition ${
                currentQuestionIndex === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Sebelumnya
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitExam}
                disabled={!answers[currentQuestionIndex]}
                className={`cursor-pointer px-6 py-2 rounded-md font-medium text-white transition ${
                  !answers[currentQuestionIndex]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isLoading ? "Loading..." : "Kirim Jawaban"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestionIndex]}
                className={`cursor-pointer px-6 py-2 rounded-md font-medium text-white transition ${
                  !answers[currentQuestionIndex]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Lanjut
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DaftarSoalUjian;
