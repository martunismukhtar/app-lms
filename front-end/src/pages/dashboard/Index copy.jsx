import { useState } from 'react';
import Aside from '../../layouts/private/Aside';

export default function Dashboard() {
  const [activeMenu, _] = useState('dashboard');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'orders', label: 'Orders', icon: '🛍️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      {/* Sidebar */}
      <Aside />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold">
              {menuItems.find((item) => item.id === activeMenu)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-indigo-600">
                <span>🔔</span>
                <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm">John Doe</span>
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                  JD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {activeMenu === 'dashboard' && <DashboardContent />}
          {activeMenu === 'users' && <UsersContent />}
          {activeMenu === 'products' && <ProductsContent />}
          {activeMenu === 'orders' && <OrdersContent />}
          {activeMenu === 'analytics' && <AnalyticsContent />}
          {activeMenu === 'settings' && <SettingsContent />}
        </main>
      </div>
    </div>
  );
}

// Dashboard Content Component
function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value="2,456" change="+12%" />
        <StatCard title="Revenue" value="$34,500" change="+8%" />
        <StatCard title="New Orders" value="156" change="-3%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            {['User registered: john_doe', 'Order #1234 placed', 'Product updated: Widget Pro', 'Payment received'].map(
              (activity, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  <span>{activity}</span>
                </li>
              )
            )}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <ActionButton icon="📄" label="Create Report" />
            <ActionButton icon="📦" label="Add Product" />
            <ActionButton icon="📤" label="Export Data" />
            <ActionButton icon="💬" label="Send Message" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, change }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
        <span
          className={`ml-2 text-sm font-medium ${
            change.startsWith('+') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}

// Action Button Component
function ActionButton({ icon, label }) {
  return (
    <button className="flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

// Users Content Component
function UsersContent() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">User Management</h3>
      <UserTable />
    </div>
  );
}

// User Table Component
function UserTable() {
  const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Viewer' },
    { id: 4, name: 'Dana White', email: 'dana@example.com', role: 'Editor' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium">{user.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Products Content Component
function ProductsContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProductCard
        title="Premium Widget"
        price="$29.99"
        stock="In Stock (150)"
        image="https://placehold.co/300x200"
      />
      <ProductCard
        title="Basic Gadget"
        price="$9.99"
        stock="Low Stock (12)"
        image="https://placehold.co/300x200"
      />
      <ProductCard
        title="Deluxe Thingamajig"
        price="$49.99"
        stock="Out of Stock"
        image="https://placehold.co/300x200"
      />
    </div>
  );
}

// Product Card Component
function ProductCard({ title, price, stock, image }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden transition-transform hover:scale-105">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xl font-bold text-indigo-600">{price}</p>
        <p
          className={`mt-2 ${
            stock.includes('In Stock') ? 'text-green-600' : stock.includes('Low Stock') ? 'text-yellow-600' : 'text-red-600'
          }`}
        >
          {stock}
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200">
            Edit
          </button>
          <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Orders Content Component
function OrdersContent() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
      <OrdersTable />
    </div>
  );
}

// Orders Table Component
function OrdersTable() {
  const orders = [
    { id: '#1001', customer: 'Sarah Wilson', product: 'Premium Widget', amount: '$29.99', status: 'Shipped' },
    { id: '#1002', customer: 'James Brown', product: 'Basic Gadget', amount: '$9.99', status: 'Processing' },
    { id: '#1003', customer: 'Maria Garcia', product: 'Deluxe Thingamajig', amount: '$49.99', status: 'Delivered' },
    { id: '#1004', customer: 'David Lee', product: 'Premium Widget', amount: '$29.99', status: 'Pending' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap font-medium">{order.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.product}</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'Delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'Shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'Processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Analytics Content Component
function AnalyticsContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
        <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
          <p className="text-gray-500">Chart Placeholder</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">Chart Placeholder</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">Chart Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Content Component
function SettingsContent() {
  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
      <h3 className="text-lg font-semibold mb-6">Settings</h3>
      
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            defaultValue="Acme Corporation"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            defaultValue="admin@acme.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>USD - US Dollar</option>
            <option>EUR - Euro</option>
            <option>GBP - British Pound</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Pacific Standard Time</option>
            <option>Eastern Standard Time</option>
            <option>Greenwich Mean Time</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

