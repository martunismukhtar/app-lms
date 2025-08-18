import { useCallback, useState } from "react";
import { fetchWithAuth } from "../../services/api";
import { MESSAGES } from "../../utils/CONSTANTA";
import useToast from "../../components/Toast/useToast";

const useHandleEnrollForm = (id) => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);
  const { showToast } = useToast();

  const handleInputChange = useCallback((e) => {
    const { value } = e.target;

    setSelectedSubjects((prevSubjects) => {
      let updatedSubjects;
      if (prevSubjects.includes(value)) {
        updatedSubjects = prevSubjects.filter((subject) => subject !== value);
      } else {
        updatedSubjects = [...prevSubjects, value];
      }

      return updatedSubjects;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoadingForm(true);
      try {
        const response = await fetchWithAuth("siswa/enroll-mtkul", {
          method: "POST", // pakai POST untuk update juga
          body: JSON.stringify({
            kelas_id: id,
            mapel_id: selectedSubjects,
          }),
        });
        showToast(response.message || MESSAGES.SUCCESS, "success");
        setLoadingForm(false);
        return true;
      } catch (error) {
        showToast(error?.message || "Gagal menghapus data", "error");
        setLoadingForm(false);
        return false;
      }
    },
    [id, selectedSubjects, showToast]
  );

  return {
    selectedSubjects,
    handleInputChange,
    handleSubmit,
    loadingForm,
  };
};
export default useHandleEnrollForm;
