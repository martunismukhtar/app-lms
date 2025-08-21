import React, { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleResend = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email tidak boleh kosong");
      return;
    }

    if (!validateEmail(email)) {
      setError("Format email tidak valid");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Simulate API call to resend verification email
      // In real implementation, you would do:
      const base_url = import.meta.env.VITE_API;
      const response = await fetch(`${base_url}auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      console.log(data);
      // Mock API response
      
      // Mock success response
      setIsSent(true);
      setSuccessMessage(`Email verifikasi telah dikirim ke ${email}`);
    } catch (err) {
      setError(
        "Terjadi kesalahan saat mengirim email verifikasi.", err
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Kembali</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isSent ? "Email Terkirim!" : "Kirim Ulang Verifikasi"}
            </h1>
            <p className="text-gray-600">
              {isSent
                ? "Periksa kotak masuk email Anda"
                : "Masukkan email Anda untuk menerima tautan verifikasi baru"}
            </p>
          </div>

          {isSent ? (
            // Success State
            <div className="text-center">
              <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-gray-700 mb-2">{successMessage}</p>
              <p className="text-gray-600 mb-8 text-sm">
                Jika tidak menerima email dalam beberapa menit, periksa folder
                spam Anda.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Kirim Ulang Email
              </button>
              <button
                onClick={() => (window.location.href = "/login")}
                className="w-full mt-4 text-blue-600 py-3 rounded-lg font-medium hover:text-blue-800 transition-colors"
              >
                Ke Halaman Login
              </button>
            </div>
          ) : (
            // Resend Form
            <>
              <form onSubmit={handleResend}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="masukkan@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div className="mb-4 flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm">{successMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Kirim Email Verifikasi
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Sudah punya akun?{" "}
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Masuk di sini
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            Tidak menerima email? Periksa folder spam Anda atau{" "}
            <button
              onClick={() => setIsSent(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              kirim ulang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
