import { useContext, useEffect } from "react";
import PrivateLayout from "../../layouts/private/Index";
import NavTab from "./NavTab";
import { UserContext } from "../../context/LayoutContext";

const DashboardSiswa = () => {
  const { setActiveMenu } = useContext(UserContext);
  useEffect(() => {
    setActiveMenu("dashboard-siswa");
  }, [setActiveMenu]);

  return (
    <PrivateLayout>
      <div className="w-full">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Portal Siswa</h1>
          <p className="text-gray-600">
            Selamat datang di portal pembelajaran Anda.
          </p>
        </header>

        <NavTab />
      </div>
    </PrivateLayout>
  );
};
export default DashboardSiswa;
