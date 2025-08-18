import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../utils/CONSTANTA";
import { fetchWithAuth } from "../../services/api";

import {
  handleInputChangeFactory,
  handleSubmitError,
  handleSubmitSuccess,
} from "../../utils/handlers";
import { fetchKelasById } from "./fetchers";
import { useQueryClient } from "@tanstack/react-query";
import useToast from "../../components/Toast/useToast";
import { TahunAjaran } from "../../utils/libs";

const useKelasForm = (id) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({});
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!id) return;

    const getData = async () => {
      setIsGetting(true);
      try {
        const data = await fetchKelasById(id);
        setFormData({
          name: data.name,
          wali_kelas: data.wali_kelas,
          tahun_ajaran: data.tahun_ajaran,
        });
      } catch (err) {
        setError(err.message);
        showToast(err.message, "error");
      } finally {
        setIsGetting(false);
      }
    };

    getData();
  }, [id, showToast]);

  const handleInputChange = handleInputChangeFactory(
    setFormData,
    setError,
    error
  );

  const submitForm = async (formData) => {
    setIsLoading(true);
    setError({});

    try {
      const endpoint = API_ENDPOINTS.KELAS + (id ? `${id}/` : "");
      const method = id ? "PUT" : "POST";

      formData.tahun_ajaran = TahunAjaran();
      const response = await fetchWithAuth(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      handleSubmitSuccess(response, showToast);
      if (!id) setFormData({});

      queryClient.invalidateQueries({
        queryKey: ["kelas"],
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
    isGetting,
  };
};

export default useKelasForm;
