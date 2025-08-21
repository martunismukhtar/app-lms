import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";

export default function VerifyEmail() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Get URL parameters when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uidParam = urlParams.get("uid");
    const tokenParam = urlParams.get("token");

    if (uidParam && tokenParam) {
      verifyEmail(uidParam, tokenParam);
    } else {
      setIsVerifying(false);
      setError(
        "Informasi verifikasi tidak lengkap. Silakan periksa kembali tautan di email Anda."
      );
    }
  }, []);

  // Function to verify email with token
  const verifyEmail = async (uidParam, tokenParam) => {
    setIsVerifying(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const base_url = import.meta.env.VITE_API;
      const response = await fetch(`${base_url}auth/verify-email/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: uidParam, token: tokenParam }),
      });

      // cek status HTTP
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (response.ok) {
        setIsVerified(true);
        setSuccessMessage("Email Anda telah berhasil diverifikasi!");
      } else {
        setError(
          data?.message ||
            "Tautan verifikasi tidak valid atau telah kedaluwarsa."
        );
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memverifikasi email.", err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isVerifying
                ? "Memverifikasi Email..."
                : isVerified
                ? "Verifikasi Berhasil!"
                : "Verifikasi Gagal"}
            </h1>
          </div>

          {/* Content */}
          <div className="text-center">
            {isVerifying ? (
              // Verification in progress
              <div className="py-8">
                <div className="flex justify-center mb-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
                <p className="text-gray-700 mb-4">
                  Sedang memverifikasi email Anda...
                </p>
              </div>
            ) : isVerified ? (
              // Success state
              <div>
                <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-gray-700 mb-2">
                  {successMessage || "Email Anda telah berhasil diverifikasi!"}
                </p>
                <p className="text-gray-600 mb-8">
                  Anda sekarang dapat menggunakan semua fitur aplikasi.
                </p>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Lanjutkan ke login
                </button>
              </div>
            ) : (
              // Error state
              <div>
                <div className="mx-auto bg-red-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <p className="text-gray-700 mb-6">
                  {error || "Terjadi kesalahan saat verifikasi email."}
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Loader className="w-5 h-5 mr-2" />
                    Coba Lagi
                  </button>
                  <button
                    onClick={() =>
                      (window.location.href = "/resend-verification")
                    }
                    className="w-full text-blue-600 py-3 rounded-lg font-medium hover:text-blue-800 transition-colors"
                  >
                    Kirim Ulang Email Verifikasi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
