import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/LayoutContext";
import { useNotification } from "../../hooks/useNotification";
import { API_ENDPOINTS, MESSAGES } from "../../utils/CONSTANTA";
import { APIError, fetchWithAuth } from "../../services/api";

export default function AutoQuestionTab() {
  const { filterData, buatSoal } = useContext(UserContext);
  const { notify } = useNotification();
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

      notify({
        type: "success",
        message: response.message || MESSAGES.SUCCESS,
      });
    },
    [notify, buatSoal]
  );

  // Handle form submission errors
  const handleSubmitError = useCallback(
    (err) => {
      setIsLoading(false);
      if (
        err instanceof APIError &&
        err.response &&
        typeof err.response === "object"
      ) {
        // Handle validation errors from API
        notify({
          type: "error",
          message: "Terdapat kesalahan pada form. Silakan periksa kembali.",
        });
      } else {
        // Handle network or other errors
        notify({
          type: "error",
          message: err.message || MESSAGES.ERROR_NETWORK,
        });
      }
    },
    [notify]
  );

  const handleSubmit = async () => {
    if (
      filterData.mapel === "" ||
      filterData.semester === "" ||
      filterData.kelas === ""
    ) {
      notify({
        type: "error",
        message: "Pilih Mapel dan Semester dan Kelas terlebih dahulu",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(API_ENDPOINTS.CREATE_QUIZ, {
        method: "POST",
        body: JSON.stringify(filterData),
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
