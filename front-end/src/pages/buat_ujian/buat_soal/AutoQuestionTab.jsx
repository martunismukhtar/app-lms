import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/LayoutContext";
import { API_ENDPOINTS, MESSAGES } from "../../../utils/CONSTANTA";
import { parseApiErrors } from "../../../utils/parseApiErrors";
import { fetchWithAuth } from "../../../services/api";
import useToast from "../../../components/Toast/useToast";

export default function AutoQuestionTab(props) {
  const { buatSoal } = useContext(UserContext);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    buatSoal([]);
  }, [buatSoal]);

  const handleSubmitSuccess = useCallback(
    (response) => {
      setIsLoading(false);
      let data = response.soal;
      const newFields = data.map((item) => {
        return {
          id: item.id,
          tipe_soal:
            item.tipe_soal === "pilihan_ganda" ? "pilihan_ganda" : "text", // pilihan_ganda "radio", // karena semua soal ini pilihan ganda
          pertanyaan: item.pertanyaan,
          answer: "", // jawaban user (jika form interaktif)
          pilihan: item.pilihan,
          jawaban_benar: item.jawaban_benar,
        };
      });

      buatSoal(newFields);

      showToast(response.message || MESSAGES.SUCCESS, "success");
    },
    [showToast, buatSoal]
  );

  // Handle form submission errors
  const handleSubmitError = useCallback(
    (err) => {
      setIsLoading(false);
      if (
        err instanceof parseApiErrors &&
        err.response &&
        typeof err.response === "object"
      ) {
        // Handle validation errors from API
        showToast("Terdapat kesalahan pada form. Silakan periksa kembali.", "error");
      } else {
        // Handle network or other errors
        showToast(err.message || MESSAGES.ERROR_NETWORK, "error");
      }
    },
    [showToast]
  );

  const handleSubmit = async () => {   
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(API_ENDPOINTS.CREATE_QUIZ, {
        method: "POST",
        body: JSON.stringify({
          ujian_id: props.ujian_id,
        }),
      });
      handleSubmitSuccess(response);
    } catch (err) {
      handleSubmitError(err);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Hasilkan Soal Otomatis dengan AI
      </h2>
      <p className="text-gray-600 mb-6">
        Klik tombol di bawah untuk membuat soal acak menggunakan kecerdasan
        buatan.
      </p>
      <button
        type="button"
        disabled={isLoading}
        onClick={handleSubmit}
        className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
        }`}
      >
        {isLoading ? MESSAGES.LOADING : "Generate Soal"}
      </button>
    </div>
  );
}
