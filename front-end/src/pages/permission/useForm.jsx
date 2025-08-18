import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/api";
import { handleSubmitSuccess } from "../../utils/handlers";
import { MESSAGES } from "../../utils/CONSTANTA";
import { usePermissionByGroup } from "./useData";
import useToast from "../../components/Toast/useToast";
import { useQueryClient } from "@tanstack/react-query";

const grouped = [];
const useFormPermisi = (permissions, id) => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: UserPermissions,
    error: ErrorUserPermissions,
    isError: isErrorUserPermissions,
    isLoading: isLoadingUserPermissions,
  } = usePermissionByGroup(id);

  useEffect(() => {
    if (UserPermissions) {
      setSelectedPermissions(UserPermissions.map((item) => item.permission_id));
    }

    permissions?.forEach((perm) => {
      const name = perm.name;
      const parts = name.split(" ");
      const entity = parts.slice(1).join(" ");

      let groupObj = grouped.find((group) => group.group === entity);

      if (!groupObj) {
        groupObj = {
          group: entity,
          permission: [],
        };
        grouped.push(groupObj);
      }

      let cek_perm_id = groupObj.permission.find((item) => item.id === perm.id);
      if (!cek_perm_id) {
        groupObj.permission.push({
          id: perm.id,
          code: perm.code,
          name: perm.name,
        });
      }
    });
  }, [UserPermissions, permissions]);

  const handleCheckboxChange = (event) => {
    const id = parseInt(event.target.value);
    if (event.target.checked) {
      setSelectedPermissions([...selectedPermissions, id]);
    } else {
      setSelectedPermissions(selectedPermissions.filter((item) => item !== id));
    }
  };
  const submitForm = async () => {
    setIsLoading(true);
    // setError({});

    try {
      const endpoint = "hak-akses/";
      const method = "POST";
      const response = await fetchWithAuth(endpoint, {
        method,
        body: JSON.stringify({
          permissions: selectedPermissions,
          group_id: id,
        }),
      });

      handleSubmitSuccess(response, showToast);
      queryClient.invalidateQueries({
        queryKey: ["permisi-berdasarkan-id"],
      });
      //permisi-berdasarkan-id
    } catch (err) {
      showToast(err.message || MESSAGES.ERROR_NETWORK, "error");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    submitForm();
  };
  // Select all handler
  const handleSelectAll = (e, permsInGroup) => {
    const { checked } = e.target;
    if (checked) {
      permsInGroup.map((item) => {
        item.permission.map((p) => {
          setSelectedPermissions((prev) => [...new Set([...prev, p.id])]);
        });
      });
    } else {
      setSelectedPermissions([]);
    }
  };

  return {
    grouped,
    handleCheckboxChange,
    handleSubmit,
    handleSelectAll,
    selectedPermissions,
    ErrorUserPermissions,
    isErrorUserPermissions,
    isLoadingUserPermissions,
    isLoading,
  };
};

export default useFormPermisi;
