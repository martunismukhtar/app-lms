import { useCallback, useEffect, useState } from "react";

const DaftarSoalUjian = ({ data }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 menit
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  const handleSubmitExam = useCallback(() => {
    setIsExamSubmitted(true);
    // Submit ke backend bisa dilakukan di sini
    console.log(answers);
  }, [answers, setIsExamSubmitted]);


  // Map data soal dari prop `data`
  useEffect(() => {
    if (!data.data || !Array.isArray(data.data)) return;

    setTimeLeft(data.durasi * 60);
    const mappedQuestions = data.data.map((item) => ({
      id: item.id,
      question: item.pertanyaan,
      options: Object.keys(item.pilihan), // ['A', 'B', 'C', 'D']
      pilihan: item.pilihan,
      correctAnswer: item.jawaban_benar,
    }));

    setQuestions(mappedQuestions);
    setAnswers(Array(mappedQuestions.length).fill(null));
  }, [data]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || isExamSubmitted) {
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isExamSubmitted, handleSubmitExam]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleAnswerChange = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = option;
    setAnswers(newAnswers);
  };

  if (questions.length === 0) return <p>Memuat soal...</p>;

  const currentQuestion = questions[currentQuestionIndex];

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
                  checked={answers[currentQuestionIndex] === option}
                  onChange={() => handleAnswerChange(option)}
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
                Kirim Jawaban
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
