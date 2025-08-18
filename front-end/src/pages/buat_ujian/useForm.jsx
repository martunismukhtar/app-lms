import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../utils/CONSTANTA";
import { fetchWithAuth } from "../../services/api";
import { useNavigate } from "react-router-dom";

import {
  handleInputChangeFactory,
  handleSubmitError,
  handleSubmitSuccess,
} from "../../utils/handlers";
import { useQueryClient } from "@tanstack/react-query";
import useToast from "../../components/Toast/useToast";

const useForm = (id, data) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({});
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  useEffect(() => {
    if (!data) return;
    setFormData(data);
  }, [id, data]);

  const handleInputChange = handleInputChangeFactory(
    setFormData,
    setError,
    error
  );

  const submitForm = async (formData) => {
    setIsLoading(true);
    setError({});

    try {
      const params = !id ? `` : `${id}/`;
      const endpoint = API_ENDPOINTS.BUAT_UJIAN + params;
      const method = id ? "PUT" : "POST";
      const response = await fetchWithAuth(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      handleSubmitSuccess(response, showToast);
      if (!id) setFormData({});

      queryClient.invalidateQueries({
        queryKey: ["daftar-ujian"],
      });
      const id_ujian = response.id;
      if (!id) navigate(`buat-soal`, { state: { id_ujian } });
    } catch (err) {
      handleSubmitError(err, setError, showToast);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm(formData);
  };

  return {
    formData,
    error,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
};

export default useForm;
