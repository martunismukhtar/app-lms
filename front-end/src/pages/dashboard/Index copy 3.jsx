import { useState } from 'react';
import {
  Home,
  Users,
  Settings,
  FileText,
  PieChart,
  Mail,
  Calendar,
  HelpCircle,
  LogOut,
  Menu,
  X,
  User,
  Bell,
  Search
} from 'lucide-react';
import SidebarComponent from '../../layouts/private/Sidebar';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Data contoh untuk tabel
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Active' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - updated to dark theme */}
      <SidebarComponent />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10 border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-slate-800">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 sm:text-sm transition-all"
                  placeholder="Search..."
                />
              </div>
              <button className="p-1 rounded-full text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                <Bell size={20} />
                <span className="sr-only">Notifications</span>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <User size={16} className="text-amber-600" />
                  </div>
                  {sidebarOpen && (
                    <span className="text-sm font-medium text-slate-700">Admin</span>
                  )}
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-slate-200">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 transition-colors"
                    >
                      Your Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 transition-colors"
                    >
                      Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 transition-colors"
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {activeTab === 'dashboard' && (
            <div>
              <h3 className="text-lg font-medium text-slate-800 mb-4">Dashboard Overview</h3>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard 
                  title="Total Users" 
                  value="1,234" 
                  change="+12%" 
                  icon={<Users size={20} className="text-blue-500" />}
                  color="blue"
                />
                <StatCard 
                  title="Total Posts" 
                  value="567" 
                  change="+5%" 
                  icon={<FileText size={20} className="text-amber-500" />}
                  color="amber"
                />
                <StatCard 
                  title="Messages" 
                  value="89" 
                  change="-2%" 
                  icon={<Mail size={20} className="text-blue-500" />}
                  color="blue"
                />
                <StatCard 
                  title="Revenue" 
                  value="$12,345" 
                  change="+23%" 
                  icon={<PieChart size={20} className="text-purple-500" />}
                  color="purple"
                />
              </div>
              {/* Recent Activity */}
              <div className="bg-white shadow rounded-lg p-6 mb-6 border border-slate-200">
                <h4 className="text-md font-medium text-slate-800 mb-4">Recent Activity</h4>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start p-3 hover:bg-slate-50 rounded-lg transition-colors">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <User size={16} className="text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">User #{item} melakukan aksi</p>
                        <p className="text-sm text-slate-500">2 hours ago</p>
                      </div>
                      <div className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-slate-800">User Management</h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                  Add New User
                </button>
              </div>
              {/* User Table */}
              <div className="bg-white shadow rounded-lg overflow-hidden border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User size={16} className="text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                              user.role === 'Editor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-800 mr-3 transition-colors">Edit</button>
                          <button className="text-rose-600 hover:text-rose-800 transition-colors">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-slate-800">Post Management</h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                  Create New Post
                </button>
              </div>
              {/* Post Form Example */}
              <div className="bg-white shadow rounded-lg p-6 mb-6 border border-slate-200">
                <h4 className="text-md font-medium text-slate-800 mb-4">Create New Post</h4>
                <form>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 sm:text-sm transition-all"
                      placeholder="Post title"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
                      Content
                    </label>
                    <textarea
                      id="content"
                      rows={4}
                      className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 sm:text-sm transition-all"
                      placeholder="Post content..."
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 sm:text-sm transition-all bg-white"
                    >
                      <option>Technology</option>
                      <option>Business</option>
                      <option>Health</option>
                      <option>Education</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="publish" className="flex items-center">
                      <input
                        id="publish"
                        name="publish"
                        type="checkbox"
                        className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-slate-300 rounded"
                      />
                      <span className="ml-2 block text-sm text-slate-700">
                        Publish immediately
                      </span>
                    </label>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all"
                    >
                      Save Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// NavItem Component


// StatCard Component
const StatCard = ({ title, value, change, icon, color = 'teal' }) => {
  const isPositive = change.startsWith('+');
  const colorClasses = {
    teal: {
      text: 'text-teal-600',
      bg: 'bg-teal-50'
    },
    amber: {
      text: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    blue: {
      text: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    purple: {
      text: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  };
  return (
    <div className="bg-white shadow rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-slate-800">{value}</p>
        </div>
        <div className={`p-3 rounded-md ${colorClasses[color].bg}`}>
          {icon}
        </div>
      </div>
      <div className={`mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-rose-600'}`}>
        <span>{change}</span>
        <span> from last month</span>
      </div>
    </div>
  );
};

export default AdminDashboard;