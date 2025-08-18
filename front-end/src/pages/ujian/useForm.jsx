import { useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS, MESSAGES } from "../../utils/CONSTANTA";
import { fetchWithAuth } from "../../services/api";
import { handleSubmitSuccess } from "../../utils/handlers";
import useToast from "../../components/Toast/useToast";

const useFormIkutUjian = (data, id_ujian) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]); 
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(null); // waktu mulai ujian
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const [selesai, setSelesai] = useState(false);
  const [hasil, setHasil] = useState({});

  const handleSubmitExam = useCallback(() => {
    if (isExamSubmitted) return; 

    setIsExamSubmitted(true);
    setIsLoading(true);
    const new_data = {
      jawaban: answers,
      waktu_mulai: startTime,
      id_ujian,
    };    
    const submit = async () => {
      try {
        const endpoint = API_ENDPOINTS.IKUT_UJIAN;
        const method = "POST";

        const response = await fetchWithAuth(endpoint, {
          method,
          body: JSON.stringify(new_data),
        });        
        setHasil({
          score: response.score,
          total_benar: response.jawaban_benar,
          total_salah: response.jawaban_salah,
          total_soal: response.jumlah_soal
        })
        handleSubmitSuccess(response, showToast);
        setSelesai(true);
      } catch (err) {
        showToast(err.message || MESSAGES.ERROR_NETWORK,"error");
      } finally {
        setIsLoading(false);
      }
    };

    submit();

    // Kirim ke backend kalau perlu
  }, [answers, startTime, id_ujian, showToast, isExamSubmitted]);

  useEffect(() => {
    setSelesai(false);
  }, [])
  // Inisialisasi soal dan jawaban
  useEffect(() => {
    if (!data?.data || !Array.isArray(data.data)) return;

    setTimeLeft((data.durasi || 30) * 60);
    setStartTime(
      new Date().toLocaleTimeString("id-ID", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    ); // waktu mulai ujian sekarang

    const mappedQuestions = data.data.map((item) => ({
      id: item.id,
      question: item.pertanyaan,
      options: Object.keys(item.pilihan),
      pilihan: item.pilihan,
      correctAnswer: item.jawaban_benar,
    }));

    setQuestions(mappedQuestions);
    setAnswers(
      Array(mappedQuestions.length)
        .fill(null)
        .map((_, index) => ({
          nomor: index + 1,
          jawaban: null,
        }))
    );
  }, [data]);

  // Timer otomatis
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

  const handleAnswerChange = (option, id_soal) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      id_soal: id_soal,
      jawaban: option,
    };
    setAnswers(newAnswers);
  };

  const currentQuestion = questions[currentQuestionIndex] || null;

  return {
    questions,
    currentQuestionIndex,
    currentQuestion,
    answers,
    timeLeft,
    formatTime,
    startTime,
    handlePrev,
    handleNext,
    handleAnswerChange,
    handleSubmitExam,
    isLoading,
    selesai,
    hasil
  };
};

export default useFormIkutUjian;
