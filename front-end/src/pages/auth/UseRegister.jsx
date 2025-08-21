import { useState } from "react";
import useToast from "../../components/Toast/useToast";
import { saveSessions } from "../../utils/permission";

const UseRegister = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    konfirmasi_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const username = form.username?.value?.trim();
    const password = form.password?.value;
    const email = form.email?.value?.trim();
    const password_confirmation = form.konfirmasi_password?.value?.trim();

    if (!username || !password || !email) {
      showToast("Username, password dan email wajib diisi!", "error");
      setLoading(false);
      return;
    }

    if (password !== password_confirmation) {
      showToast("Password dan konfirmasi password tidak cocok!", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API}auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();
      if (res.ok) {
        setForm({
          username: "",
          password: "",
          email: "",
          konfirmasi_password: "",
        })
        saveSessions({
          access: data.access,
          refresh: data.refresh,
          organization: data.organization,
          roles: data.roles,
          permissions: data.permissions,
        });
        showToast(`Data berhasil disimpan`, "success");
      } else {
        showToast(data?.message || "Anda tidak terdafar", "error");
      }
    } catch (error) {
      showToast(error?.message || "Terjadi kesalahan jaringan.", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    loading,
    form,
    handleChange
  };
};

export default UseRegister;
