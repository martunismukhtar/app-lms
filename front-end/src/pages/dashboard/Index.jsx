import { useContext, useEffect } from "react";
import PrivateLayout from "../../layouts/private/Index";
import { UserContext } from "../../context/LayoutContext";
import { isStudent, isTeacher } from "../../utils/permission";

import DashboardSiswa from "./siswa/Index";
import DashboardGuru from "./guru/Index";

const AdminDashboard = () => {
  const { setActiveMenu } = useContext(UserContext);
  useEffect(() => {
    setActiveMenu("dashboard");
  }, [setActiveMenu]);

  return (
    <PrivateLayout>
      {isTeacher() && <DashboardGuru />}
      {isStudent() && <DashboardSiswa />}
    </PrivateLayout>
  );
};

export default AdminDashboard;
