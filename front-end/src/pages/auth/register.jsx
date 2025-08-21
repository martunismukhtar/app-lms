import { Brain, Eye, EyeOff, Lock, ArrowLeft, User } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../../components/Input/InputIcon";
import Button from "../../components/Button/Index";
import GoogleLoginButton from "./GoogleLoginButton";
import UseRegister from "./UseRegister";
import { useState } from "react";

export default function RegisterPage() {
  const { handleSubmit, loading } = UseRegister();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Buat Akun Baru
              </h1>
              <p className="text-gray-600 mt-2">
                Silakan daftarkan diri Anda untuk mulai menggunakan
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Masukkan username"
                  required
                  name="username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="contoh@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    required
                  />

                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    label="Konfirmasi Password"
                    type={showPassword ? "text" : "password"}
                    name="konfirmasi_password"
                    placeholder="Konfirmasi Password"
                    required
                  />

                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02]"
              >
                Daftar
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <hr className="flex-grow border-gray-300" />              
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Registration Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Masuk
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Kembali ke beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
