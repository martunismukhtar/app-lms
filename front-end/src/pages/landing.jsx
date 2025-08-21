import React, { useState, useEffect } from 'react';
import { ChevronRight, Brain, BookOpen, MessageSquare, Upload, Zap, Users, CheckCircle, Star, Menu, X, ArrowRight, Sparkles, Eye, EyeOff, Mail, Lock, User, School } from 'lucide-react';

import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'login', 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('student'); // 'student', 'teacher'

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Render different pages based on currentPage state
  if (currentPage === 'login') {
    return <LoginPage />;
  }

  if (currentPage === 'register') {
    return <RegisterPage />;
  }

  const features = [
    {
      icon: <Brain className="w-12 h-12 text-blue-600" />,
      title: "Pembuatan Soal Otomatis",
      description: "AI menganalisis materi yang diupload guru dan secara otomatis membuat berbagai jenis soal berkualitas tinggi"
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-purple-600" />,
      title: "Asisten AI untuk Siswa",
      description: "Siswa dapat bertanya langsung kepada AI tentang materi pembelajaran yang telah diupload"
    },
    {
      icon: <Upload className="w-12 h-12 text-green-600" />,
      title: "Upload Materi Mudah",
      description: "Upload berbagai format materi dan biarkan AI memproses untuk pembelajaran yang lebih efektif"
    }
  ];

  const stats = [
    { number: "10K+", label: "Guru Aktif" },
    { number: "20K+", label: "Siswa Terdaftar" },
    { number: "1M+", label: "Soal Dibuat AI" },
    { number: "98%", label: "Tingkat Kepuasan" }
  ];

  // Login Page Component
  const LoginPage = () => (
    <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Masuk ke EduForge
            </h1>
            <p className="text-gray-600 mt-2">Selamat datang kembali! Silakan masuk ke akun Anda</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-12 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Password Anda"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">Ingat saya</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md"
            >
              Masuk
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <button
                onClick={() => setCurrentPage('register')}
                className="text-blue-600 hover:text-blue-500 transition-colors font-medium"
              >
                Daftar sekarang
              </button>
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('landing')}
            className="mt-6 w-full text-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Kembali ke beranda
          </button>
        </div>
      </div>
    </div>
  );

  // Register Page Component
  const RegisterPage = () => (
    <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Daftar EduForge
            </h1>
            <p className="text-gray-600 mt-2">Bergabunglah dengan revolusi pembelajaran AI</p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Daftar sebagai</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('student')}
                className={`p-4 rounded-lg border transition-all ${
                  userType === 'student'
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Siswa</div>
              </button>
              <button
                type="button"
                onClick={() => setUserType('teacher')}
                className={`p-4 rounded-lg border transition-all ${
                  userType === 'teacher'
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <School className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Guru</div>
              </button>
            </div>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            {userType === 'teacher' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Sekolah/Institusi</label>
                <div className="relative">
                  <School className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Nama sekolah atau institusi"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-12 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Buat password yang kuat"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-12 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Ulangi password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1" />
              <label className="ml-2 text-sm text-gray-700">
                Saya setuju dengan{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors">
                  Syarat & Ketentuan
                </a>{' '}
                dan{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors">
                  Kebijakan Privasi
                </a>
              </label>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-md ${
                userType === 'student'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
              }`}
            >
              Daftar sebagai {userType === 'student' ? 'Siswa' : 'Guru'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-blue-600 hover:text-blue-500 transition-colors font-medium"
              >
                Masuk sekarang
              </button>
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('landing')}
            className="mt-6 w-full text-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Kembali ke beranda
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                EduForge
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Fitur</a>                            
              <Link to="login" className="text-gray-700 hover:text-blue-600 transition-colors">Masuk</Link>              
              <Link 
                to="login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-full text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md"
              >
                Mulai Sekarang
              </Link>
            </div>

            <button 
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-blue-600 transition-colors">Fitur</a>
              <a href="#pricing" className="block text-gray-700 hover:text-blue-600 transition-colors">Harga</a>
              <a href="#contact" className="block text-gray-700 hover:text-blue-600 transition-colors">Kontak</a>
              <Link
                to="register"
                className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                Masuk
              </Link>
              <Link 
                onClick={() => setCurrentPage('register')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-full text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
              >
                Mulai Sekarang
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white rounded-full px-4 py-2 mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
              <span className="text-sm text-gray-700">Revolusi Pembelajaran dengan AI</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight">
              LMS Cerdas
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bertenaga AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Platform pembelajaran yang mengintegrasikan kecerdasan buatan untuk 
              <span className="text-blue-600 font-medium"> pembuatan soal otomatis</span> dan 
              <span className="text-purple-600 font-medium"> asisten pembelajaran interaktif</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setCurrentPage('register')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-full text-lg font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Coba Gratis Sekarang
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
              <button className="border border-gray-300 bg-white px-8 py-4 rounded-full text-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                Lihat Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Fitur Unggulan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Teknologi AI terdepan untuk pengalaman pembelajaran yang tak tertandingi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-8 rounded-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                  activeFeature === index 
                    ? 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 shadow-md' 
                    : 'bg-white border border-gray-200 hover:shadow-md'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Feature Details */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">Untuk Guru</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Upload Materi Mudah</h4>
                      <p className="text-gray-600">Upload file PDF, PPT, atau dokumen lainnya</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Soal Otomatis</h4>
                      <p className="text-gray-600">AI membuat soal pilihan ganda, essay, dan true/false</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Analisis Pembelajaran</h4>
                      <p className="text-gray-600">Dashboard komprehensif untuk tracking progress</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">Untuk Siswa</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Tanya AI Kapan Saja</h4>
                      <p className="text-gray-600">Ajukan pertanyaan tentang materi 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Pembelajaran Adaptif</h4>
                      <p className="text-gray-600">AI menyesuaikan tingkat kesulitan sesuai kemampuan</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Progress Tracking</h4>
                      <p className="text-gray-600">Monitor kemajuan belajar secara real-time</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Kata Mereka
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Wijaya",
                role: "Kepala Sekolah SMAN 1 Jakarta",
                content: "EduForge mengubah cara kami mengajar. Pembuatan soal yang dulunya memakan waktu berjam-jam, kini hanya butuh beberapa menit!",
                rating: 5
              },
              {
                name: "Ahmad Rizki",
                role: "Guru Matematika",
                content: "Siswa lebih aktif bertanya karena AI selalu siap membantu. Ini revolusi dalam dunia pendidikan!",
                rating: 5
              },
              {
                name: "Siti Nurhaliza",
                role: "Siswa SMA",
                content: "Belajar jadi lebih menyenangkan! AI bisa menjelaskan materi yang sulit dengan cara yang mudah dipahami.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Siap Memulai Revolusi Pembelajaran?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Bergabunglah dengan ribuan guru dan siswa yang telah merasakan kemudahan belajar dengan AI
          </p>
          <button 
            onClick={() => setCurrentPage('register')}
            className="bg-white px-12 py-4 rounded-full text-xl font-bold text-blue-600 hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Mulai Gratis Hari Ini
            <Zap className="w-6 h-6 ml-2 inline" />
          </button>
          <p className="text-blue-100 mt-4">Tidak perlu kartu kredit • Setup dalam 5 menit</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">EduForge</span>
              </div>
              <p className="text-gray-600">
                Platform LMS cerdas yang mengintegrasikan AI untuk pembelajaran yang lebih efektif.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Produk</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Fitur AI</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">LMS Platform</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Perusahaan</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Karir</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Dukungan</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Kontak</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">API Docs</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2025 EduForge. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}