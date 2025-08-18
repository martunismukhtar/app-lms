
import Header from "./Header";
import SidebarComponent from "./Sidebar";

const PrivateLayout = ({ children }) => {  

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - updated to dark theme */}
      <SidebarComponent />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto bg-slate-50">
          {children}
        </main>
      </div>
      
    </div>
  );
};
export default PrivateLayout;
