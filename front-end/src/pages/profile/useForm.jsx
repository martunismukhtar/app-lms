import { useEffect, useState } from "react";
import { useProfile } from "../../data/Index";
import { fetchWithAuth } from "../../services/api";
import { handleSubmitSuccess } from "../../utils/handlers";
import { MESSAGES } from "../../utils/CONSTANTA";
import useToast from "../../components/Toast/useToast";

const form = {
  nama: "",
  username: "",
  email: "",
  password: "",
};

const useFormProfile = () => {
  const {
    data: data_form,
    error: errorProfile,
    isError: isErrorProfile,
    isLoading: loadingProfile,
    refetch,
  } = useProfile();

  const [data, setData] = useState(form);
  const [isLoading, setLoading] = useState(false);
   const { showToast } = useToast();

  useEffect(() => {
    if (!data_form) return;

    setData({
      nama: data_form.nama,
      username: data_form.username,
      email: data_form.email,
    });
    
  }, [data_form]);

  const submitForm = async (formData) => {
    setLoading(true);
    
    try {    
      const method = "POST";
      const response = await fetchWithAuth('profile/', {
        method,
        body: JSON.stringify(formData),
      });

      handleSubmitSuccess(response, showToast);
      
    } catch (err) {
      showToast(err.message || MESSAGES.ERROR_NETWORK, "error");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm(data);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  return {
    data,
    errorProfile,
    isErrorProfile,
    loadingProfile,
    handleSubmit,
    handleInputChange,
    refetch,
    isLoading
  };
};

export default useFormProfile;
