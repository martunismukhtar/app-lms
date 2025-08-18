import { useContext, useEffect, useState } from "react";
import LoadingButton from "../../components/LoadingButton";
import LoadingButtonClik from "../../components/LoadingButtonClik";
import { fetchWithAuth } from "../../services/api";
import { API_ENDPOINTS, MESSAGES } from "../../utils/CONSTANTA";
import { UserContext } from "../../context/LayoutContext";
import { useNotification } from "../../hooks/useNotification";
import RichEditor from "../../components/Editor/Index";

export default function ManualQuestionTab() {
  const [fields, setFields] = useState([]);
  const [newFieldType, setNewFieldType] = useState("text");
  const [isLoading, setLoading] = useState(false);
  const { notify } = useNotification();
  const { filterData, buatSoal } = useContext(UserContext);

  useEffect(() => {
   buatSoal([]); 
  }, [buatSoal]);
  
  const addField = () => {
    const newField = {
      id: Date.now(),
      type: newFieldType,
      question: `Pertanyaan ${fields.length + 1}`,
      options:
        newFieldType === "radio"
          ? ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"]
          : [],
      correctAnswerIndex: 0, // default index
    };
    setFields([...fields, newField]);
  };

  const updateQuestion = (id, value) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, question: value } : field
      )
    );
  };

  const updateAnswer = (id, value) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, answer: value } : field
      )
    );
  };

  const updateCorrectAnswer = (fieldId, index) => {
    setFields(
      fields.map((field) =>
        field.id === fieldId ? { ...field, correctAnswerIndex: index } : field
      )
    );
  };

  const updateOption = (fieldId, index, value) => {
    setFields(
      fields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options.map((opt, i) =>
                i === index ? value : opt
              ),
            }
          : field
      )
    );
  };

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    buatSoal([]);

    const data = {
      semester: filterData.semester,
      kelas: filterData.kelas,
      mapel: filterData.mapel,
      fields: fields,
    };

    if (!filterData.kelas || !filterData.mapel) {
      notify({
        type: "error",
        message: "Pilih kelas dan mata pelajaran",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetchWithAuth(API_ENDPOINTS.CREATE_QUIZ_MANUAL, {
        method: "POST",
        body: JSON.stringify(data),
      });

      let hasil = response.soal;
      const newFields = hasil.map((item) => {        
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
    } catch (error) {
      notify({
        type: "error",
        message: error.message || "Terjadi kesalahan",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto overflow-y-auto m-2">
      <div className="w-full mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Form Builder Area */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Input Sidebar */}
          <div className="space-y-4 max-w-[300px]">
            <h2 className="text-lg font-semibold text-gray-700">
              Tambah Field
            </h2>
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-sm text-gray-600">
                Jenis Field
              </label>
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="text">Input Text</option>
                <option value="radio">Radio Button</option>
              </select>
            </div>
            <button
              onClick={addField}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Tambah Field
            </button>
          </div>

          {/* Dynamic Form Preview */}
          <div className="col-start-2 col-end-5 space-y-3">
            <h2 className="text-lg font-semibold text-gray-700">
              Preview Form
            </h2>
            {fields.length === 0 ? (
              <p className="text-gray-400 italic">
                Belum ada field yang ditambahkan.
              </p>
            ) : (
              <form className="space-y-6">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className="relative group border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <button
                      type="button"
                      onClick={() => removeField(field.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>

                    <div className="mb-4">
                      <label className="block mb-2 font-medium text-gray-700">
                        Pertanyaan:
                      </label>
                      <RichEditor
                        value={field.question}
                        onChange={(e) => updateQuestion(field.id, e)}
                        className="min-h-[100px]"
                      />
                      {/* <input
                        type="text"
                        value={field.question}
                        onChange={(e) =>
                          updateQuestion(field.id, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      /> */}
                    </div>

                    {field.type === "text" && (
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">
                          Jawaban:
                        </label>
                        <input
                          type="text"
                          placeholder="Masukkan jawaban..."
                          value={field.answer}
                          onChange={(e) =>
                            updateAnswer(field.id, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}

                    {field.type === "radio" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block font-medium text-gray-700">
                            Pilihan Jawaban:
                          </label>
                          {field.options.map((option, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="radio"
                                name={`radio-${field.id}`}
                                readOnly
                                checked={idx === field.correctAnswerIndex}
                                className="text-indigo-600"
                              />
                              <RichEditor
                                value={field.question}
                                onChange={(e) => updateOption(field.id, idx, e)}
                                className="h-[50px]"
                              />
                              {/* <input
                                type="text"
                                value={option}
                                onChange={(e) =>
                                  updateOption(field.id, idx, e.target.value)
                                }
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                              /> */}
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="block font-medium text-gray-700 mb-1">
                            Jawaban Benar:
                          </label>
                          <select
                            value={field.correctAnswerIndex}
                            onChange={(e) =>
                              updateCorrectAnswer(
                                field.id,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            {field.options.map((_, idx) => (
                              <option key={idx} value={idx}>
                                Pilihan {String.fromCharCode(65 + idx)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </form>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <LoadingButtonClik
            onClick={handleSubmit}
            disabled={fields.length === 0}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
