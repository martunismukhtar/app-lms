// import { APIError } from "../../services/api";
// import { parseApiErrors } from "../../utils/parseApiErrors";
// import { MESSAGES } from "../../utils/CONSTANTA";

import { APIError } from "../../../services/api";
import { MESSAGES } from "../../../utils/CONSTANTA";
import { parseApiErrors } from "../../../utils/parseApiErrors";

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

export const handleSubmitSuccess = (response, notify) => {
  notify({
    type: "success",
    message: response.message || MESSAGES.SUCCESS,
  });
};

export const handleSubmitError = (err, setError, notify) => {
  notify({
    type: "error",
    message: MESSAGES.ERROR_DEFAULT,
  });

  if (err instanceof APIError && err.response && typeof err.response === "object") {
    setError(parseApiErrors(err.response));
  } else {
    notify({
      type: "error",
      message: err.message || MESSAGES.ERROR_NETWORK,
    });
  }
};
