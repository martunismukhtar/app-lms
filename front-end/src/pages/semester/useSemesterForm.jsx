import { useEffect, useState } from "react";
import { API_ENDPOINTS, MESSAGES } from "../../utils/CONSTANTA";
import { APIError, fetchWithAuth } from "../../services/api";
import { parseApiErrors } from "../../utils/parseApiErrors";
import { useQuery } from "@tanstack/react-query";
import useToast from "../../components/Toast/useToast";

const INITIAL_FORM_DATA = {
  tahun: "",
  semester: "",
  is_aktif: true,
};

const fetchSemester = async () => {
  const response = await fetchWithAuth(API_ENDPOINTS.GET_SEMESTER, {
    method: "GET",
  });
  return response;
};

const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  REFETCH_INTERVAL: 5 * 60 * 1000, // 5 minutes
};

// Custom Hook for Mata Pelajaran Data
const useSemesterData = () => {
  return useQuery({
    queryKey: ["semester-list"],
    queryFn: fetchSemester,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: QUERY_CONFIG.STALE_TIME,
    cacheTime: QUERY_CONFIG.CACHE_TIME,
    refetchInterval: QUERY_CONFIG.REFETCH_INTERVAL,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

const useSemesterForm = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: semesterData,
    isLoading: isLoadingSemester,
    error: errorSemester,
  } = useSemesterData();

  useEffect(() => {
    if (semesterData?.length > 0) {
      const { tahun, semester, is_aktif } = semesterData[0];
      setFormData({ tahun, semester, is_aktif });
    }
  }, [semesterData]);

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

  const handleSubmitSuccess = (response) => {
    showToast(response.message || MESSAGES.SUCCESS, "success");
  };

  const handleSubmitError = (err) => {
    showToast(MESSAGES.ERROR_DEFAULT, "error");

    if (
      err instanceof APIError &&
      err.response &&
      typeof err.response === "object"
    ) {
      setError(parseApiErrors(err.response));
    } else {
      showToast(err.message || MESSAGES.ERROR_NETWORK, "error");      
    }
  };

  const submitForm = async (formData) => {
    setIsLoading(true);
    setError({});

    try {
      const response = await fetchWithAuth(API_ENDPOINTS.CREATE_SEMESTER, {
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
    isLoadingSemester,
    errorSemester,
  };
};

export default useSemesterForm;
