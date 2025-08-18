import { useEffect, useState } from "react";

const DaftarSoal = ({ data }) => {
  const [fields, setFields] = useState([]);
  // const [newFieldType, setNewFieldType] = useState("text");

  useEffect(() => {
    if (!data || data.length === 0) return;

    const newFields = data.map((item) => {
      const pilihan = [];
      let correctAnswerIndex = 0;

      const entries = Object.entries(item.pilihan);
      entries.forEach(([key, value], index) => {
        pilihan.push(value);
        if (key === item.jawaban_benar) {
          correctAnswerIndex = index;
        }
      });

      return {
        id: item.id,
        type: item.tipe_soal === "pilihan_ganda" ? "radio" : "text", // pilihan_ganda "radio", // karena semua soal ini pilihan ganda
        question: item.pertanyaan,
        answer: "", // jawaban user (jika form interaktif)
        options: pilihan,
        correctAnswerIndex: correctAnswerIndex,
      };
    });

    setFields(newFields);
  }, [data]);

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
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
        field.id === fieldId
          ? { ...field, correctAnswerIndex: index }
          : field
      )
    );
  };

  const handleSubmit=()=>{
    console.log(fields);
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="p-4 border-b border-gray-100 flex justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Soal</h2>
        <a
          href="materi/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tambah
        </a>
      </div>
      <div className="overflow-x-auto overflow-y-auto m-2">
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div className="relative group border border-gray-200 rounded-lg p-4 bg-gray-50">
              <form className="space-y-6">
                {fields.map((field) => (
                  <div key={field.id} className="relative group border border-black rounded-lg p-4 bg-gray-50 mb-4 border-dashed">
                    <button
                      type="button"  
                      onClick={() => removeField(field.id)}                    
                      className="cursor-pointer absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>

                    <div className="mb-4">
                      <label className="block mb-2 font-medium text-gray-700">
                        Pertanyaan:
                      </label>
                      <input
                        type="text"
                        value={field.question}
                        onChange={(e) => updateQuestion(field.id, e.target.value)}                     
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {field.type === 'text' && (
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">
                          Jawaban:
                        </label>
                        <input
                          type="text"
                          placeholder="Masukkan jawaban..."
                          onChange={(e) => updateAnswer(field.id, e.target.value)}
                          value={field.answer}                      
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}

                    {field.type === 'radio' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block font-medium text-gray-700">
                            Pilihan Jawaban:
                          </label>
                          {field.options.map((option, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`radio-${field.id}`}
                                disabled
                                checked={false}
                                className="text-indigo-600"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) =>
                                  updateOption(field.id, idx, e.target.value)
                                }
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                              />
                            </div>
                          ))}
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-1">
                            Jawaban Benar:
                          </label>
                          <select
                            value={field.correctAnswerIndex}
                            onChange={(e) => updateCorrectAnswer(field.id, parseInt(e.target.value))}
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
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Simpan
                  </button>
                  </div>          
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DaftarSoal;
