import React, { useState } from "react";
import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  Bell,
  Settings,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  User,
  Menu,
  X,
} from "lucide-react";

const ClassCard = ({ classData }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-gray-900">{classData.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{classData.schedule}</p>
        <div className="flex items-center mt-3 text-sm text-gray-500">
          <Users className="w-4 h-4 mr-1" />
          <span>{classData.students} siswa</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
          <Eye className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
          <Edit className="w-4 h-4" />
        </button>
      </div>
    </div>
    <div className="mt-4">
      <button className="w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
        <Plus className="w-4 h-4 mr-2" />
        Tambah Materi
      </button>
    </div>
  </div>
);

const ActivityItem = ({ activity }) => (
  <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900">{activity.student}</p>
      <p className="text-sm text-gray-600">
        {activity.activity} di {activity.class}
      </p>
      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
    </div>
  </div>
);

const TaskItem = ({ task }) => {
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{task.title}</h4>
        <p className="text-sm text-gray-600">{task.class}</p>
      </div>
      <div className="flex items-center space-x-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            priorityColors[task.priority]
          }`}
        >
          {task.due}
        </span>
        <button className="text-gray-400 hover:text-blue-600">
          <Edit className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);
const DashboardGuru = () => {
  //   const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data
  const classes = [
    {
      id: 1,
      name: "Matematika Kelas 10A",
      students: 32,
      schedule: "Senin & Rabu, 08:00",
    },
    {
      id: 2,
      name: "Fisika Kelas 11B",
      students: 28,
      schedule: "Selasa & Kamis, 10:00",
    },
    { id: 3, name: "Kimia Kelas 12C", students: 30, schedule: "Jumat, 13:00" },
  ];

  const recentActivities = [
    {
      id: 1,
      student: "Ahmad Rifai",
      class: "Matematika 10A",
      activity: "Mengumpulkan tugas",
      time: "2 menit yang lalu",
    },
    {
      id: 2,
      student: "Siti Nurhaliza",
      class: "Fisika 11B",
      activity: "Memposting diskusi",
      time: "15 menit yang lalu",
    },
    {
      id: 3,
      student: "Budi Santoso",
      class: "Kimia 12C",
      activity: "Mengikuti kuis",
      time: "1 jam yang lalu",
    },
    {
      id: 4,
      student: "Dewi Kartika",
      class: "Matematika 10A",
      activity: "Menonton video pembelajaran",
      time: "3 jam yang lalu",
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Koreksi Ujian Akhir",
      class: "Matematika 10A",
      due: "Besok",
      priority: "high",
    },
    {
      id: 2,
      title: "Buat Materi Baru",
      class: "Fisika 11B",
      due: "3 hari lagi",
      priority: "medium",
    },
    {
      id: 3,
      title: "Jadwalkan Ujian Tengah Semester",
      class: "Kimia 12C",
      due: "1 minggu lagi",
      priority: "low",
    },
  ];

  const stats = [
    { title: "Total Siswa", value: "120", icon: Users, color: "bg-blue-500" },
    { title: "Kelas Aktif", value: "8", icon: BookOpen, color: "bg-green-500" },
    // {
    //   title: "Tugas Dikumpulkan",
    //   value: "156",
    //   icon: Calendar,
    //   color: "bg-purple-500",
    // },
    // {
    //   title: "Rata-rata Nilai",
    //   value: "85.5",
    //   icon: BarChart3,
    //   color: "bg-orange-500",
    // },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Guru</h1>
        <p className="text-gray-600 mt-1">
          Selamat datang kembali, Budi Santoso
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Kelas Saya
              </h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Lihat Semua
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((classData) => (
                <ClassCard key={classData.id} classData={classData} />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Aktivitas Terbaru
          </h2>
          <div className="space-y-1">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div> */}
      </div>

      {/* Upcoming Tasks */}
      {/* <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Tugas Mendatang
          </h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Tugas
          </button>
        </div>
        <div>
          {upcomingTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default DashboardGuru;
