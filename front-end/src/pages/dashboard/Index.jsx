// import SidebarComponent from '../../layouts/private/Sidebar';
import { useContext, useEffect } from "react";
import PrivateLayout from "../../layouts/private/Index";
import { UserContext } from "../../context/LayoutContext";
import { can } from "../../utils/permission";

import DashboardSiswa from "./siswa/Index";
import DashboardGuru from "./guru/Index";

const AdminDashboard = () => {
  const { setActiveMenu } = useContext(UserContext);
  useEffect(() => {
    setActiveMenu("dashboard");
  }, [setActiveMenu]);

  return (
    <PrivateLayout>
      {can("view_dashboard_teacher") && <DashboardGuru />}
      {can("view_dashboard_siswa") && <DashboardSiswa />}
    </PrivateLayout>
  );
};

export default AdminDashboard;
