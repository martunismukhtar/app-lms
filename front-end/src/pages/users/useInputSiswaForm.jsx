import { useState, useCallback } from "react";
import { API_ENDPOINTS, MESSAGES } from "../../utils/CONSTANTA";
import { APIError, fetchWithAuth } from "../../services/api";
import { parseApiErrors } from "../../utils/parseApiErrors";
import { useQueryClient } from "@tanstack/react-query";
import useToast from "../../components/Toast/useToast";

// Constants
const INITIAL_FORM_DATA = {
  mapel: [],
  kelas: "",
  file: null,
};

const useInputSiswaForm = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  // State management
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

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

      if (name === "mapel") {
        setSelectedSubjects((prevSubjects) => {
          let updatedSubjects;
          if (prevSubjects.includes(value)) {
            updatedSubjects = prevSubjects.filter(
              (subject) => subject !== value
            );
          } else {
            updatedSubjects = [...prevSubjects, value];
          }

          // Update formData setelah selectedSubjects diperbarui
          setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: updatedSubjects,
          }));

          return updatedSubjects;
        });
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: inputValue,
        }));
      }

      // Clear error ketika user menginput
      clearFieldError(name);
    },
    [clearFieldError, setFormData, setSelectedSubjects]
  );

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedSubjects([]);
    setError({});
  }, []);

  // Handle successful form submission
  const handleSubmitSuccess = useCallback(
    (response) => {
      showToast(response.message || MESSAGES.SUCCESS,"success");
      resetForm();
      // Reset form after successful submission
    },
    [showToast, resetForm]
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
        showToast(err.message || MESSAGES.ERROR_NETWORK,"error");
      }
    },
    [showToast]
  );

  // Validate form data before submission
  const validateForm = useCallback((data) => {
    const validationErrors = {};

    if (!data.kelas) {
      validationErrors.kelas = "Kelas harus dipilih";
    }

    if (!data.mapel) {
      validationErrors.mapel = "Mata pelajaran harus dipilih";
    }

    if (data.file) {
      if (data.file.type !== "text/csv") {
        validationErrors.file = "File harus berformat csv";
      }
    }

    return validationErrors;
  }, []);

  // Create FormData object for file upload
  const createFormData = useCallback((data) => {
    const formDataObj = new FormData();
    formDataObj.append("mapel", data.mapel);
    formDataObj.append("kelas", data.kelas);
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
        const response = await fetchWithAuth(API_ENDPOINTS.CREATE_USER, {
          method: "POST", // pakai POST untuk update juga
          body: formDataObj,
        });
        queryClient.invalidateQueries({
          queryKey: ["user"],
        });
        handleSubmitSuccess(response);
      } catch (err) {
        handleSubmitError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [
      validateForm,
      createFormData,
      handleSubmitSuccess,
      handleSubmitError,
      queryClient,
    ]
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
    resetForm,
    selectedSubjects,
    // Utilities
    clearFieldError,
  };
};

export default useInputSiswaForm;
