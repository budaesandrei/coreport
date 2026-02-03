import { Box, Typography } from "@mui/material";
import { useListProjectUser } from "@hooks/ProjectUsers/useListProjectUser";
import { useCreateProjectUser } from "@hooks/ProjectUsers/useCreateProjectUser";
import { useUpdateProjectUser } from "@hooks/ProjectUsers/useUpdateProjectUser";
import { useDeleteProjectUser } from "@hooks/ProjectUsers/useDeleteProjectUser";
import { useState, useEffect, useCallback, useMemo } from "react";
import { GridRowId, GridRowModel, GridRowModesModel } from "@mui/x-data-grid";
import { createColumns as baseCreateColumns } from "@components/common/Tables/TableColumns/projectUsers";
import { CRUDTable } from "@components/common/Tables/Table/CRUDTable";
import { useListProviders } from "@hooks/Providers/useListProviders";

const UsersPresentation: React.FC = () => {
  const [
    {
      data: projectUsers,
      loading: projectUsersLoading,
      error: projectUsersError,
    },
    resolveProjectUsers,
  ] = useListProjectUser();
  const [{ loading: createLoading }, resolveCreateProjectUser] =
    useCreateProjectUser();
  const [{ loading: updateLoading }, resolveUpdateProjectUser] =
    useUpdateProjectUser();
  const [{ loading: deleteLoading }, resolveDeleteProjectUser] =
    useDeleteProjectUser();

  const [{ data: providers = [] }, resolveProviders] = useListProviders();
  const [resolvedProviders, setResolvedProviders] = useState(false);

  useEffect(() => {
    if (!resolvedProviders) {
      resolveProviders();
      setResolvedProviders(true);
    }
  }, [resolvedProviders, resolveProviders]);

  const providerOptions = useMemo(() =>{
    return providers?.filter(provider => provider.is_active)?.map(provider => provider.name) || [];
  }, [providers]);

  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!resolved) {
      resolveProjectUsers();
      setResolved(true);
    }
  }, [resolved, resolveProjectUsers]);

  const loading =
    projectUsersLoading || createLoading || updateLoading || deleteLoading;

  const getCreatePayload = (row: GridRowModel) => {
    return {
      email: row.email,
      first_name: row.first_name,
      last_name: row.last_name,
      role: row.role,
    };
  };

  const getUpdatePayload = (row: GridRowModel) => {
    return {
      first_name: row.first_name,
      last_name: row.last_name,
      role: row.role,
      provider_name: row.provider_name,
      status: row.status,
    };
  };

  const createColumns = useCallback(
    (
      rowModesModel: GridRowModesModel,
      handleSaveClick: (id: GridRowId) => () => void,
      handleCancelClick: (id: GridRowId) => () => void,
      handleEditClick: (id: GridRowId) => () => void,
      handleDeleteClick: (id: GridRowId) => () => void
    ) => {
      return baseCreateColumns(
        rowModesModel,
        handleSaveClick,
        handleCancelClick,
        handleEditClick,
        handleDeleteClick,
        providerOptions
      );
    },
    [providerOptions]
  );

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Users
      </Typography>
      {projectUsersError && (
        <Typography color="error">Error: {projectUsersError}</Typography>
      )}

      <CRUDTable
        initialRows={projectUsers as GridRowModel[]}
        loading={loading}
        addButtonText="Invite User"
        recordType="User"
        defaultFocusField="first_name"
        createColumns={createColumns}
        createPromise={resolveCreateProjectUser}
        updatePromise={resolveUpdateProjectUser}
        deletePromise={resolveDeleteProjectUser}
        getCreatePayload={getCreatePayload}
        getUpdatePayload={getUpdatePayload}
      />
    </Box>
  );
};

export default UsersPresentation;
