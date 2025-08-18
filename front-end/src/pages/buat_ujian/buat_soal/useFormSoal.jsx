import { useEffect, useState } from "react";

import {
  handleInputChangeFactory,
  handleSubmitError,
  handleSubmitSuccess,
} from "./handlers";
import { useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../../utils/CONSTANTA";
import { fetchWithAuth } from "../../../services/api";
import useToast from "../../../components/Toast/useToast";

const useFormSoal = (id, data) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({});
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {  
    if (!data) return;
    setFormData(data);
  }, [id, data]);

  const handleInputChange = handleInputChangeFactory(
    setFormData,
    setError,
    error
  );
  const handleRadioChange = (e) => {
    console.log(e.target.value);
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      jawaban_benar: value,
    }));
  };

  const handlePilihanChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      pilihan: {
        ...prev.pilihan,
        [key]: value,
      },
    }));
  };

  const handlePertanyaanChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      pertanyaan: value,
    }));
  };

  const submitForm = async (formData) => {
    setIsLoading(true);
    setError({});

    try {
      const params = !id ? `` : `${id}`;
      const endpoint = API_ENDPOINTS.UPDATE_SOAL + params;
      const method = id ? "PUT" : "POST";
      const response = await fetchWithAuth(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      handleSubmitSuccess(response, showToast);

      queryClient.invalidateQueries({
        queryKey: ["daftar-soal", id],
      });
      
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
    handleRadioChange,
    handlePilihanChange,
    handlePertanyaanChange
  };
};

export default useFormSoal;
