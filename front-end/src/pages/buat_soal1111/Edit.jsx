import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWithAuth } from "../../services/api";
import { useNotification } from "../../hooks/useNotification";
import { MESSAGES } from "../../utils/CONSTANTA";
import PrivateLayout from "../../layouts/private/Index";
import RichEditor from "../../components/Editor/Index";
import LoadingButton from "../../components/LoadingButton";
import { UserContext } from "../../context/LayoutContext";

const EditSoal = () => {
  const { id } = useParams();
  const { notify } = useNotification();

  const [soal, setSoal] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Edit Soal";
    setActiveMenu("soal");
  }, [setActiveMenu]);

  // Ambil data soal saat komponen mount
  useEffect(() => {
    if (!id) return;

    const fetchSoal = async () => {
      try {
        const response = await fetchWithAuth(`soal/edit/${id}`, {
          method: "GET",
        });
        setSoal(response);
      } catch (error) {
        notify({
          type: "error",
          message: error.message || MESSAGES.ERROR_NETWORK,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSoal();
  }, [id, notify]);

  const handlePertanyaanChange = (value) => {
    setSoal((prev) => ({
      ...prev,
      pertanyaan: value,
    }));
  };

  const handlePilihanChange = (key, value) => {
    setSoal((prev) => ({
      ...prev,
      pilihan: {
        ...prev.pilihan,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetchWithAuth(`soal/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(soal),
      });
      notify({
        type: "success",
        message: response.message,
      });
    } catch (error) {
      notify({
        type: "error",
        message: error.message || MESSAGES.ERROR_NETWORK,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRadioChange=(e)=>{
    const {value} = e.target;
    setSoal((prev) => ({
      ...prev,
      jawaban_benar: value,
    }));
  }

  if (loading) {
    return <PrivateLayout>Loading...</PrivateLayout>;
  }

  if (!soal) {
    return <PrivateLayout>Soal tidak ditemukan.</PrivateLayout>;
  }

  return (
    <PrivateLayout>
      <div className="p-4 bg-white shadow rounded">
        <h1 className="text-xl font-bold mb-6">Edit Soal</h1>

        <form onSubmit={handleSubmit}>         
          <div className="mb-6 p-4  rounded shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Pertanyaan
            </h2>
            <RichEditor
              value={soal.pertanyaan}
              onChange={handlePertanyaanChange}
              className="min-h-[120px]"
            />
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Pilihan Jawaban
            </h2>
            {soal.pilihan &&
              Object.entries(soal.pilihan).map(([key, value]) => (
                <div key={key} className="flex items-start space-x-3 mb-4">
                  <input
                    type="radio"
                    name={`radio-${soal.id}`}      
                    onChange={handleRadioChange}    
                    value={key}          
                    checked={soal.jawaban_benar === key}
                    className="cursor-pointer mt-2 w-6 h-6 text-indigo-600 accent-indigo-600 focus:ring-2 focus:ring-indigo-400"
                  />
                  <div className="flex-1">
                    <RichEditor
                      value={value}
                      onChange={(e) => handlePilihanChange(key, e)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              ))}
          </div>

          {/* Tombol Submit */}
          <div className="flex justify-end">
            <LoadingButton isLoading={saving}>Simpan</LoadingButton>
          </div>
        </form>
      </div>
    </PrivateLayout>
  );
};

export default EditSoal;
