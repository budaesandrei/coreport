import { Box, Typography } from "@mui/material";
import { useListProviders } from "@hooks/Providers/useListProviders";
import { useCreateProvider } from "@hooks/Providers/useCreateProvider";
import { useUpdateProvider } from "@hooks/Providers/useUpdateProvider";
import { useDeleteProvider } from "@hooks/Providers/useDeleteProvider";
import { useState, useEffect } from "react";
import { GridRowModel } from "@mui/x-data-grid";
import { createColumns } from "@components/common/Tables/TableColumns/providers";
import { CRUDTable } from "@components/common/Tables/Table/CRUDTable";

const ProvidersPresentation: React.FC = () => {
  const [
    { data: providers, loading: providersLoading, error: providersError },
    resolveProviders,
  ] = useListProviders();
  const [{ loading: createLoading }, resolveCreateProvider] =
    useCreateProvider();
  const [{ loading: updateLoading }, resolveUpdateProvider] =
    useUpdateProvider();
  const [{ loading: deleteLoading }, resolveDeleteProvider] =
    useDeleteProvider();

  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!resolved) {
      resolveProviders();
      setResolved(true);
    }
  }, [resolved, resolveProviders]);

  const loading =
    providersLoading || createLoading || updateLoading || deleteLoading;

  const getCreatePayload = (row: GridRowModel) => {
    return {
      name: row.name,
      description: row.description,
      is_active: row.is_active,
    };
  };

  const getUpdatePayload = (row: GridRowModel) => {
    return {
      name: row.name,
      description: row.description,
      is_active: row.is_active,
    };
  };


  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Providers
      </Typography>
      {providersError && (
        <Typography color="error">Error: {providersError}</Typography>
      )}

      <CRUDTable
        initialRows={providers as GridRowModel[]}
        loading={loading}
        addButtonText="Add Provider"
        recordType="Provider"
        defaultFocusField="name"
        createColumns={createColumns}
        createPromise={resolveCreateProvider}
        updatePromise={resolveUpdateProvider}
        deletePromise={resolveDeleteProvider}
        getCreatePayload={getCreatePayload}
        getUpdatePayload={getUpdatePayload}
      />
    </Box>
  );
};

export default ProvidersPresentation;
