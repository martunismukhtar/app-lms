import { useState, useCallback, useEffect } from "react";
import { useNotification } from "../../hooks/useNotification";
import { API_ENDPOINTS, MESSAGES } from "../../utils/CONSTANTA";
import { APIError, fetchWithAuth } from "../../services/api";
import { parseApiErrors } from "../../utils/parseApiErrors";

// Constants
const INITIAL_FORM_DATA = {
  mapel: "",
  title: "",
  file: null,
};


const useAIForm = () => {
  const { notify } = useNotification();

  // State management
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setError({});
  }, []);

  // Handle successful form submission
  const handleSubmitSuccess = useCallback(
    (response) => {
      notify({
        type: "success",
        message: response.message || MESSAGES.SUCCESS,
      });

      // Reset form after successful submission
      if(!id)
        resetForm();
    },
    [notify, resetForm, id]
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

        notify({
          type: "error",
          message: "Terdapat kesalahan pada form. Silakan periksa kembali.",
        });
      } else {
        // Handle network or other errors
        notify({
          type: "error",
          message: err.message || MESSAGES.ERROR_NETWORK,
        });
      }
    },
    [notify]
  );

  // Validate form data before submission
  const validateForm = useCallback((data) => {
    const validationErrors = {};

    if (!data.mapel) {
      validationErrors.mapel = "Mata pelajaran harus dipilih";
    }

    if (!data.title?.trim()) {
      validationErrors.title = "Judul materi harus diisi";
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
        if (Object.keys(validationErrors).length > 0) {
          setError(validationErrors);
          return;
        }

        // Prepare form data for submission
        const formDataObj = createFormData(data);

        const response = await fetchWithAuth(API_ENDPOINTS.CREATE_QUIZ,
          {
            method: "POST", 
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
    [validateForm, createFormData, handleSubmitSuccess, handleSubmitError]
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

    handleSubmit
  };
};

export default useAIForm;
