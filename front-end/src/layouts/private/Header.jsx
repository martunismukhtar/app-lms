import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Bell, Search } from "lucide-react";
import { UserContext } from "../../context/LayoutContext";
import { getItem } from "../../utils/permission";
import useToast from "../../components/Toast/useToast";

const Header = () => {
  const { sidebarOpen } = useContext(UserContext);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { showToast } = useToast();

  const navigate = useNavigate();
  const handleLogout = async () => {
    const refresh_token = getItem("refresh");
    const access = getItem("access");
    try {
      const data = {
        refresh: refresh_token,
        access: access,
      };

      await fetch(`${import.meta.env.VITE_API}auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(() => {
          navigate("/login");
        });
    } catch (error) {
      showToast("Terjadi kesalahan saat logout" + error.message, "error");
    }
  };

  return (
    <header className="bg-white shadow-sm z-10 border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-slate-800"></h2>
        </div>
        <div className="flex items-center space-x-4">
          {/* <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 sm:text-sm transition-all"
              placeholder="Search..."
            />
          </div> */}
          {/* <button className="p-1 rounded-full text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors">
            <Bell size={20} />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button> */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <User size={16} className="text-amber-600" />
              </div>
              {sidebarOpen && (
                <span className="text-sm font-medium text-slate-700 cursor-pointer">
                  {getItem("user").username}
                </span>
              )}
            </button>
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-slate-200">
                <Link
                  to={"/profile"}
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 transition-colors"
                >
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer block px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 transition-colors"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
