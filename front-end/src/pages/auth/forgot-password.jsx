import { Link } from 'react-router-dom';
import LandingLayout from "../../layouts/landing/Index";

export default function ForgotPasswordPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Instruksi reset kata sandi telah dikirim ke email Anda.');
  };

  return (
    <LandingLayout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg transform transition hover:shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Lupa Kata Sandi?</h2>
        <p className="text-gray-600 text-center mb-8">
          Masukkan alamat email yang terkait dengan akun Anda, kami akan mengirimkan instruksi untuk mereset kata sandi.
        </p>

        {/* Form Reset Password */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="contoh@email.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transform hover:-translate-y-0.5 transition"
          >
            Kirim Instruksi Reset
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">atau</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Kembali ke halaman masuk
          </Link>
        </div>
      </div>
    </div>
    </LandingLayout>
  );
}