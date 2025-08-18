import { useState } from "react";
import { API_ENDPOINTS, MESSAGES, STORAGE_KEYS } from "../../utils/CONSTANTA";
import { getItem, updateSessionItem } from "../../utils/permission";
import { APIError, fetchWithAuth } from "../../services/api";
import { parseApiErrors } from "../../utils/parseApiErrors";
import useToast from "../../components/Toast/useToast";

const INITIAL_FORM_DATA = {
  name: "",
  email: "",
  alamat: "",
  kota: "",
  provinsi: "",
};
const useOrganizationForm = () => {
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState(() => 
    getItem(STORAGE_KEYS.ORGANIZATION) || INITIAL_FORM_DATA
  );
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error saat user mulai mengetik
    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmitSuccess = (response, formData) => {
    updateSessionItem(STORAGE_KEYS.ORGANIZATION, formData);
    showToast(response.message || MESSAGES.SUCCESS,"success");
  };

  const handleSubmitError = (err) => {
    showToast(MESSAGES.ERROR_DEFAULT,"error");
    
    if (err instanceof APIError && err.response && typeof err.response === "object") {
      setError(parseApiErrors(err.response));
    } else {
      showToast(err.message || MESSAGES.ERROR_NETWORK,"error");      
    }
  };

  const submitForm = async (formData) => {
    setIsLoading(true);
    setError({});

    try {
      const response = await fetchWithAuth(API_ENDPOINTS.CREATE_ORGANIZATION, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      
      handleSubmitSuccess(response, formData);
    } catch (err) {
      handleSubmitError(err);
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

export default useOrganizationForm;