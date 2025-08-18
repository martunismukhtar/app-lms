import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/api";

import {
  handleInputChangeFactory,
  handleSubmitError,
  handleSubmitSuccess,
} from "../../utils/handlers";
import { useQueryClient } from "@tanstack/react-query";
import useToast from "../../components/Toast/useToast";

const data_form = {
  nama: "",
  kode: "",
  kelompok: "",
};

const useForm = (id, data) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(data_form);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data?.length > 0) {
      const { nama, kode, kelompok } = data[0];
      setFormData({ nama, kode, kelompok });
    }
  }, [data]);

  const handleInputChange = handleInputChangeFactory(
    setFormData,
    setError,
    error
  );

  const submitForm = async (formData) => {
    setIsLoading(true);
    setError({});

    try {
      const params = !id ? `` : `${id}/update`;
      const endpoint = "mapel/" + params;
      const method = id ? "PUT" : "POST";
      const response = await fetchWithAuth(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      handleSubmitSuccess(response, showToast);
      if (!id) setFormData(data_form);

      queryClient.invalidateQueries({
        queryKey: ["mapel"],
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
  };
};

export default useForm;
