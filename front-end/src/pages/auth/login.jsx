import { Brain, EyeOff, Lock, ArrowLeft, User } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../../components/Input/InputIcon";
import Button from "../../components/Button/Index";
import GoogleLoginButton from "./GoogleLoginButton";
import UseLogin from "./UseLogin";

const LoginPage = () => {
  const { handleSubmit, loading } = UseLogin();

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
                Masuk ke EduAI
              </h1>
              <p className="text-gray-600 mt-2">
                Selamat datang kembali! Silakan masuk ke akun Anda
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pr-10 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    label="Username"
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
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
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                  />

                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <EyeOff className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Lupa password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02]"
              >
                Masuk
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-500 text-sm">atau</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Social Login - Google */}
            {!loading && <GoogleLoginButton />}

            {/* Registration Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Daftar sekarang
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
};

export default LoginPage;
