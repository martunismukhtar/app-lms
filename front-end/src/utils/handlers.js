
import { APIError } from "../services/api";
import { MESSAGES } from "./CONSTANTA";
import { parseApiErrors } from "./parseApiErrors";

export const handleInputChangeFactory = (setFormData, setError, error) => (e) => {
  const { name, value } = e.target;   

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (error[name]) {
    setError((prev) => ({
      ...prev,
      [name]: null,
    }));
  }
};

export const handleSubmitSuccess = (response, showToast) => {
  showToast(response.message || MESSAGES.SUCCESS, "succes")
};

export const handleSubmitError = (err, setError, showToast) => {
  showToast(MESSAGES.ERROR_DEFAULT,"error");

  if (err instanceof APIError && err.response && typeof err.response === "object") {
    setError(parseApiErrors(err.response));
  } else {
    showToast(err.message || MESSAGES.ERROR_NETWORK,"error");    
  }
};
