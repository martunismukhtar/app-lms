import { useState, useCallback, useEffect } from "react";
import { API_ENDPOINTS, MESSAGES } from "../../utils/CONSTANTA";
import { APIError, fetchWithAuth } from "../../services/api";
import { parseApiErrors } from "../../utils/parseApiErrors";
import useToast from "../../components/Toast/useToast";
import { fetchMateriById } from "./useMateri";

// Constants
const INITIAL_FORM_DATA = {
  mapel: "",
  title: "",
  kelas: "",
  content: "",
  file: null,
};


const useMateriForm = (id) => {
  const { showToast } = useToast();

  // State management
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchMateri = async () => {
        try {
          const response = await fetchMateriById(id);

          setFormData({
            mapel: response.mapel,
            title: response.title,
            kelas: response.kelas,
            content: response.content,
          });
        } catch (err) {
          console.error("Error fetching materi:", err);
          showToast("Error fetching materi", "error");
        } 
      };
      fetchMateri();
    }    

  }, [id, showToast]);

  // Clear specific field error
  const clearFieldError = useCallback((fieldName) => {
    setError((prevError) => {
      if (!prevError[fieldName]) return prevError;

      const { [fieldName]: _, ...restErrors } = prevError;
      return restErrors;
    });
  }, []);

  // Handle input changes
  const handleInputChange = useCallback(
    (e) => {
      const { name, value, files } = e.target;
      const inputValue = files ? files[0] : value;

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: inputValue,
      }));

      // Clear error when user starts typing/selecting
      clearFieldError(name);
    },
    [clearFieldError]
  );

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setError({});
  }, []);

  // Handle successful form submission
  const handleSubmitSuccess = useCallback(
    (response) => {
      showToast(response.message || MESSAGES.SUCCESS,"success");

      // Reset form after successful submission
      if (!id) resetForm();
    },
    [showToast, resetForm, id]
  );

  // Handle form submission errors
  const handleSubmitError = useCallback(
    (err) => {
      if (
        err instanceof APIError &&
        err.response &&
        typeof err.response === "object"
      ) {
        // Handle validation errors from API
        const parsedErrors = parseApiErrors(err.response);
        setError(parsedErrors);
        showToast("Terdapat kesalahan pada form. Silakan periksa kembali.","error");
        
      } else {
        // Handle network or other errors
        showToast(err.message || MESSAGES.ERROR_NETWORK,"error");        
      }
    },
    [showToast]
  );

  // Validate form data before submission
  const validateForm = useCallback((data) => {
    const validationErrors = {};

    if (!data.mapel) {
      validationErrors.mapel = "Mata pelajaran harus dipilih";
    }

    if (!data.kelas) {
      validationErrors.kelas = "Kelas harus dipilih";
    }

    if (!data.title?.trim()) {
      validationErrors.title = "Judul materi harus diisi";
    }

    if (!data.content?.trim()) {
      validationErrors.file = "Ringkasan materi harus diisi";
    }

    if (data.file) {
      if (data.file.type !== "application/pdf") {
        validationErrors.file = "File harus berformat PDF";
      }
    }

    return validationErrors;
  }, []);

  // Create FormData object for file upload
  const createFormData = useCallback((data) => {
    const formDataObj = new FormData();

    formDataObj.append("mapel", data.mapel);
    formDataObj.append("title", data.title.trim());
    formDataObj.append("kelas", data.kelas);
    formDataObj.append("content", data.content.trim());

    if (data.file) {
      formDataObj.append("file", data.file);
    }

    return formDataObj;
  }, []);

  // Submit form data to API
  const submitForm = useCallback(
    async (data) => {
      setIsLoading(true);
      setError({});
      
      try {
        // Client-side validation
        const validationErrors = validateForm(data);
        console.log(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
          setError(validationErrors);
          return;
        }

        // Prepare form data for submission
        const formDataObj = createFormData(data);

        const response = await fetchWithAuth(
          id
            ? `${API_ENDPOINTS.GET_MATERI}${id}/edit`
            : API_ENDPOINTS.CREATE_MATERI,
          {
            method: "POST", // pakai POST untuk update juga
            body: formDataObj,
          }
        );

        handleSubmitSuccess(response);
      } catch (err) {
        handleSubmitError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [validateForm, createFormData, handleSubmitSuccess, handleSubmitError, id]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      submitForm(formData);
    },
    [formData, submitForm]
  );

  return {
    // State
    formData,
    error,
    isLoading,

    // Actions
    handleInputChange,
    handleSubmit,    
    setFormData
  };
};

export default useMateriForm;
