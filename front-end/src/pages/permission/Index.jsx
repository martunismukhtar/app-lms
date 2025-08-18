import { Link } from "react-router-dom";
import ErrorComponent from "../../components/error/Index";
import LoadingComponent from "../../components/loading/Index";
import PrivateLayout from "../../layouts/private/Index";
import GroupedPermissions from "./GroupedPermissions";
import { useDataGroup } from "./useData";
import { UserContext } from "../../context/LayoutContext";
import { useContext, useEffect } from "react";

const Permission = () => {
  const { data, isLoading, isError, error, refetch } = useDataGroup();
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Hak Akses";
    setActiveMenu("hak-akses");
  }, [setActiveMenu]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="border-b border-gray-200 mb-4 p-3">
          <h1>Group Akses</h1>
        </div>

        <table className="min-w-full table-auto text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3">Nama Group</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.map((exam) => (
              <tr key={exam.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{exam.name}</td>

                <td className="px-4 py-3">
                  <Link
                    to={`permission/${exam.id}/tambah-hak-akses`}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Tambah Hak Akses
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PrivateLayout>
  );
};
export default Permission;
