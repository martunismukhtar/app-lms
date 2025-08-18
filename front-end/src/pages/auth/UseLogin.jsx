import { useState } from "react";
import useToast from "../../components/Toast/useToast";
import { saveSessions } from "../../utils/permission";
import { useNavigate } from "react-router-dom";

const UseLogin = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const username = form.username?.value?.trim();
    const password = form.password?.value;

    if (!username || !password) {
      showToast("Username dan password wajib diisi!", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API}auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();      
      if (res.ok) {
        saveSessions({
          access: data.access,
          refresh: data.refresh,
          organization: data.organization,
          roles: data.roles,
          permissions: data.permissions,
          user: data.user,
        });
        showToast(
          `Login berhasil: ${data?.user?.email || "Pengguna"}`,
          "success"
        );
        
        setTimeout(() => {
          navigate(data.organization ? "/dashboard" : "/organisasi");
        }, 3000);
      } else {
        console.error("Login error:", res);
        showToast(res?.error || "Anda tidak terdafar", "error");
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
  };
};

export default UseLogin;
