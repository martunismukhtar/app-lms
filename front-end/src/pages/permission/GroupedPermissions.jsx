import ErrorMessage from "../../components/ErrorMessage";
import LoadingButton from "../../components/LoadingButton";
import useFormPermisi from "./useForm";
import { useGroupName } from "./useData";
import { UserContext } from "../../context/LayoutContext";
import { useContext, useEffect } from "react";

const GroupedPermissions = ({ permissions, id }) => {
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Hak Akses";
    setActiveMenu("hak-akses");
  }, [setActiveMenu]);
  const {
    grouped,
    handleCheckboxChange,
    handleSubmit,
    handleSelectAll,
    selectedPermissions,
    ErrorUserPermissions,
    isErrorUserPermissions,
    isLoadingUserPermissions,
    isLoading,
    refetch,
  } = useFormPermisi(permissions, id);

  const {
    data,
    isLoading: isLoadingGroupName,
    isError: isErrorGroupName,
  } = useGroupName(id);

  if (isErrorUserPermissions || isErrorGroupName) {
    return (
      <ErrorMessage
        message={ErrorUserPermissions?.message || "Failed to load group data"}
        onRetry={refetch}
      />
    );
  }

  if (isLoadingUserPermissions || isLoadingGroupName) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="border-b border-gray-200 mb-4 p-2">
        <h1>
          Nama Group: {data && data[0]?.name ? data[0].name : "Tidak diketahui"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mt-2 border-b border-gray-400 pb-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              onChange={(e) => handleSelectAll(e, grouped)}
            />
            <span className="text-sm">Select All</span>
          </label>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {grouped.map((group) => (
            <div key={group.group} className="mb-4">
              <h2 className="text-lg font-semibold capitalize mb-2">
                {group.group}
              </h2>
              {group.permission.map((action) => (
                <div key={action.id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`perm-${action.id}`}
                    value={action.id}
                    checked={selectedPermissions.includes(action.id)}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`perm-${action.id}`}
                    className="text-gray-700"
                  >
                    {action.name}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <LoadingButton isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
};

export default GroupedPermissions;
