import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm backdrop-blur-md bg-opacity-90 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-600 tracking-wide">
          <a href="/">
            EduForge
          </a>          
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a
            href="#features"
            className="hover:text-indigo-600 transition duration-300"
          >
            Fitur
          </a>
          <a
            href="#how-it-works"
            className="hover:text-indigo-600 transition duration-300"
          >
            Cara Kerja
          </a>
          <a
            href="#testimonials"
            className="hover:text-indigo-600 transition duration-300"
          >
            Testimoni
          </a>
          <a
            href="#contact"
            className="hover:text-indigo-600 transition duration-300"
          >
            Kontak
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transform hover:-translate-y-1 transition"
          >
            Daftar
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t animate-fadeInDown">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a
              href="#features"
              className="hover:text-indigo-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Fitur
            </a>
            <a
              href="#how-it-works"
              className="hover:text-indigo-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Cara Kerja
            </a>
            <a
              href="#testimonials"
              className="hover:text-indigo-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimoni
            </a>
            <a
              href="#contact"
              className="hover:text-indigo-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Kontak
            </a>
            <hr className="border-gray-200" />
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Daftar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;
