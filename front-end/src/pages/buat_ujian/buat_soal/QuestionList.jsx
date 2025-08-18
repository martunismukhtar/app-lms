import { useState } from "react";

import { Link } from "react-router-dom";
import useActionsSoal from "./useActions";
import Konfirmasi from "../../../components/Konfirmasi/Index";

export default function QuestionList({ questions }) {
  const [fields, setFields] = useState([]);
  const { handleOpenDelete, isModalOpen, handleDelete, setIsModalOpen } =
    useActionsSoal();

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

  const updateCorrectAnswer = (fieldId, index) => {
    setFields(
      fields.map((field) =>
        field.id === fieldId ? { ...field, correctAnswerIndex: index } : field
      )
    );
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
        Belum ada soal yang dibuat. Silakan tambahkan soal.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto overflow-y-auto m-2">
      <div className="max-w-2xl">
        <div className="space-y-6">
          <div className="relative group border border-gray-200 rounded-lg p-4 bg-gray-50">
            <form className="space-y-6">
              {questions.data.map((field) => (
                <div
                  key={field.id}
                  className="relative group border border-black rounded-lg p-4 bg-gray-50 mb-4 border-dashed"
                >
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(field)}
                      className="cursor-pointer text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      X
                    </button>
                    <Link
                      to={`/soal/edit/${field.id}`}
                      className="cursor-pointer text-indigo-500 hover:text-indigo-700  opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      edit
                    </Link>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">
                      Pertanyaan: {field.type_soal}
                    </label>
                    <input
                      type="text"
                      value={field.pertanyaan}
                      readOnly
                      onChange={(e) => updateQuestion(field.id, e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {field.tipe_soal === "text" && (
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Jawaban:
                      </label>
                      <input
                        type="text"
                        placeholder="Masukkan jawaban..."
                        readOnly
                        onChange={(e) => updateAnswer(field.id, e.target.value)}
                        value={field.jawaban_benar}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  {field.tipe_soal === "pilihan_ganda" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block font-medium text-gray-700">
                          Pilihan Jawaban:
                        </label>
                        {Object.entries(field.pilihan).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <input
                              type="radio"
                              name={`radio-${field.id}`}
                              readOnly
                              checked={field.jawaban_benar === key}
                              className="text-indigo-600"
                            />
                            <input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                updateOption(field.id, key, e.target.value)
                              }
                              className="border border-gray-300 rounded px-2 py-1 w-full"
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">
                          Jawaban Benar: {JSON.stringify(field.jawaban_benar)}
                        </label>
                        <select
                          disabled
                          value={field.jawaban_benar}
                          onChange={(e) =>
                            updateCorrectAnswer(
                              field.id,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {Object.entries(field.pilihan).map(([key, value]) => (
                            <option key={key} value={key}>
                              {key}. {value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </form>
          </div>
        </div>
      </div>
      <Konfirmasi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDelete}
        message={`Yakin ingin menghapus data soal ?`}
      />
    </div>

    // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //   {questions.map((q) => (
    //     <div
    //       key={q.id}
    //       className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    //     >
    //       <div className="p-5">
    //         <div className="flex justify-between items-center mb-2">
    //           <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-800">
    //             {q.type}
    //           </span>
    //           <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-800">
    //             {q.source}
    //           </span>
    //         </div>
    //         <h3 className="text-lg font-medium text-gray-900 mb-2">{q.text}</h3>
    //         <p className="text-sm text-gray-600 italic">Jawaban: {q.answer}</p>
    //       </div>
    //     </div>
    //   ))}
    // </div>
  );
}
