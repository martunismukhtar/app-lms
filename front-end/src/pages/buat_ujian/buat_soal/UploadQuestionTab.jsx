import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/LayoutContext";
import { API_ENDPOINTS, MESSAGES } from "../../../utils/CONSTANTA";
import { parseApiErrors } from "../../../utils/parseApiErrors";
import { fetchWithAuth } from "../../../services/api";
import useToast from "../../../components/Toast/useToast";
import SubmitButton from "../../../components/Button/SubmitButton";

export default function UploadQuestionTab(props) {
  const [isLoading, setIsLoading] = useState(false);
  const { buatSoal } = useContext(UserContext);
  const { showToast } = useToast();
  const [form, setForm] = useState({});

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
        showToast(
          "Terdapat kesalahan pada form. Silakan periksa kembali.",
          "error"
        );
      } else {
        // Handle network or other errors
        showToast(err.message || MESSAGES.ERROR_NETWORK, "error");
      }
    },
    [showToast]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    buatSoal([]);
    try {
      setIsLoading(true);
      const formDataObj = new FormData();

      formDataObj.append("ujian_id", form.ujian_id);
      formDataObj.append("file", form.file);

      const response = await fetchWithAuth(
        API_ENDPOINTS.CREATE_QUIZ_BY_UPLOAD,
        {
          method: "POST",
          body: formDataObj,
        }
      );

      handleSubmitSuccess(response);
    } catch (err) {
      handleSubmitError(err);
    }
    // Kirim data ke API atau simpan di state global
  };

  const handleChange = (e) => {
    setForm({
      ujian_id: props.ujian_id,
      file: e.target.files[0],
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Unggah Soal dari File PDF
      </h2>
      <p className="text-gray-600 mb-4">
        Silakan pilih file PDF yang ingin Anda impor soalnya.
      </p>
      <div>
        Contoh format soal:<br></br>
        1. tuliskan soal<br></br>
        A. pilihan 1<br></br>
        B. pilihan 2<br></br>
        C. pilihan 3<br></br>
        D. pilihan 4<br></br>
        Jawaban : A
      </div>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <div>
          <input
            type="file"
            accept="application/pdf"
            name="file"
            required
            onChange={handleChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div className="flex justify-end border-t border-gray-200 pt-4">
          <SubmitButton isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
}
