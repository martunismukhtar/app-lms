import { useState } from "react";
import Button from "../../components/Button/Index";

export default function FormInputUser() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simple validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nama harus diisi";
    if (!formData.username.trim()) newErrors.username = "Username harus diisi";
    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(false);
    // Kirim data ke API atau simpan di state global
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Create New User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nama"
            type="text"
            name="name"
            placeholder="John Doe"
            required={true}
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <Input
            label="Username"
            type="text"
            name="username"
            placeholder="johndoe123"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button variant="primary" 
            type="submit"
            loading={submitting}>
            Simpan
          </Button>
        </form>
      </div>
    </div>
  );
}
