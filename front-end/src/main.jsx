
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import LandingPage from "./pages/landing.jsx";
import NotFoundPage from "./pages/notfound.jsx";

import LoginPage from "./pages/auth/login.jsx";
import RegisterPage from "./pages/auth/register.jsx";
import ForgotPasswordPage from "./pages/auth/forgot-password.jsx";
import PrivateRoute from "./pages/routes/PrivateRoute.jsx";
import { UserProvider } from "./context/LayoutContext.jsx";
import Users from "./pages/users/Index.jsx";
// import TanyaAI from './pages/tanya_ai/Index.jsx';
import Materi from "./pages/materi/Index.jsx";
import MateriForm from "./pages/materi/Form.jsx";
import BuatSoalManualForm from "./pages/buat_soal_manual/Form.jsx";
import Ujian from "./pages/ujian/Index.jsx";
import Organization from "./pages/organization/Index.jsx";
import UserFormInput from "./pages/users/UserFormInput.jsx";
import AdminDashboard from "./pages/dashboard/Index.jsx";
import Semester from "./pages/semester/Index.jsx";
import EditMateriForm from "./pages/materi/Edit.jsx";
import DashboardSiswa from "./pages/dashboard_siswa/Index.jsx";
import EditSoal from "./pages/buat_ujian/buat_soal/Edit.jsx";
import Kelas from "./pages/kelas/Index.jsx";
import TambahKelas from "./pages/kelas/Add.jsx";
import EditKelasForm from "./pages/kelas/Edit.jsx";
import MateriSiswa from "./pages/materi_siswa/Index.jsx";
import DaftarMateri from "./pages/materi_siswa/DaftarMateri.jsx";
import BuatUjian from "./pages/buat_ujian/Index.jsx";
import TambahDataUjian from "./pages/buat_ujian/Add.jsx";
import DetailUjian from "./pages/buat_ujian/Show.jsx";
import EditUjian from "./pages/buat_ujian/Edit.jsx";
import TambahSoal from "./pages/buat_ujian/buat_soal/Add.jsx";
import DataSoalUjian from "./pages/buat_ujian/TampilkanSoal.jsx";
import TanyaAI from "./pages/materi_siswa/tanya_ai/Index.jsx";
import Profile from "./pages/profile/Index.jsx";
import Guru from "./pages/guru/Index.jsx";
import TambahGuru from "./pages/guru/Add.jsx";
import EditGuru from "./pages/guru/Edit.jsx";
import Permission from "./pages/permission/Index.jsx";
import HakAkses from "./pages/permission/HakAkses.jsx";

import { ToastProvider } from "./components/Toast/ToastContext.jsx";
import Mapel from "./pages/mapel/Index.jsx";
import TambahMapel from "./pages/mapel/Add.jsx";
import EditMapel from "./pages/mapel/Edit.jsx";
import Siswa from "./pages/siswa/Index.jsx";
import SiswaFormInput from "./pages/siswa/UserFormInput.jsx";
import EnrollTeacher from "./pages/mapel/EnrollTeacher.jsx";
import SiswaPerkelas from "./pages/siswa/SiswaPerkelas.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  // ✅ Protected routes
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "semester", element: <Semester /> },
      { path: "organisasi", element: <Organization /> },
      { path: "users", element: <Users /> },
      { path: "users/create", element: <UserFormInput /> },
      // { path: "tanya-ai", element: <TanyaAI /> },
      { path: "materi", element: <Materi /> },
      { path: "materi/create", element: <MateriForm /> },
      { path: "materi/:id/edit", element: <EditMateriForm /> },
      //soal

      //kelas
      { path: "kelas", element: <Kelas /> },
      { path: "kelas/create", element: <TambahKelas /> },
      { path: "kelas/edit/:id", element: <EditKelasForm /> },

      //buat ujian
      { path: "buat-ujian", element: <BuatUjian /> },
      { path: "buat-ujian/create", element: <TambahDataUjian /> },
      { path: "buat-ujian/:id/detail", element: <DetailUjian /> },
      { path: "buat-ujian/:id/edit", element: <EditUjian /> },
      { path: "buat-ujian/:id/buat-soal", element: <TambahSoal /> },
      { path: "buat-ujian/:id/soal-ujian", element: <DataSoalUjian /> },
      { path: "soal/edit/:id", element: <EditSoal /> },

      //mapel
      { path:"mapel/", element: <Mapel />},
      { path:"mapel/create", element: <TambahMapel /> },
      { path: "mapel/:id/edit", element: <EditMapel /> },
      { path: "mapel/:id/enroll", element: <EnrollTeacher /> },

      //materi siswa
      { path: "materi-siswa", element: <MateriSiswa /> },
      { path: "materi-siswa/detail/:pel_id/:kelas_id", element: <DaftarMateri /> },
      { path: "materi-siswa/:id/tanya-ai", element: <TanyaAI /> },

      { path: "buat-soal-manual/create", element: <BuatSoalManualForm /> },
      { path: "ujian/:id", element: <Ujian /> },
      { path: "dashboard-siswa", element: <DashboardSiswa /> },

      //profile
      { path:"profile/", element: <Profile />},

      //guru
      { path:"guru/", element: <Guru />},
      { path:"guru/create", element: <TambahGuru /> },
      { path: "guru/:id/edit", element: <EditGuru /> },

      //siswa
      { path:"siswa/", element: <Siswa />},
      { path:"siswa/create", element: <SiswaFormInput /> },
      { path:"siswa/:id/kelas", element: <SiswaPerkelas /> },
      
      //hak akses
      { path:"hak-akses/", element: <Permission />},
      { path:"hak-akses/permission/:id/tambah-hak-akses", element: <HakAkses />},
      
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")).render(
  <>
    <ToastProvider>
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider />
        {/* <ToastContainer position="top-right" autoClose={3000} /> */}
        <RouterProvider router={router} />
        
      </QueryClientProvider>
    </UserProvider>
    </ToastProvider>
  </>
);
