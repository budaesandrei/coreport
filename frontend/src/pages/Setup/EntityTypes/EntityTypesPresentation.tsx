import { Box, Typography } from "@mui/material";
import { useListEntityTypes } from "@hooks/EntityTypes/useListEntityTypes";
import { useCreateEntityType } from "@hooks/EntityTypes/useCreateEntityType";
import { useUpdateEntityType } from "@hooks/EntityTypes/useUpdateEntityType";
import { useDeleteEntityType } from "@hooks/EntityTypes/useDeleteEntityType";
import { useState, useEffect } from "react";
import { GridRowModel } from "@mui/x-data-grid";
import { createColumns } from "@components/common/Tables/TableColumns/entityTypes";
import { CRUDTable } from "@components/common/Tables/Table/CRUDTable";
import { EntityAttributes } from "@components/common/Tables/Details/EntityAttributes";


const EntityTypesPresentation: React.FC = () => {
  const [
    { data: entityTypes, loading: entityTypesLoading, error: entityTypesError },
    resolveEntityTypes,
  ] = useListEntityTypes();
  const [{ loading: createLoading }, resolveCreateEntityType] =
    useCreateEntityType();
  const [{ loading: updateLoading }, resolveUpdateEntityType] =
    useUpdateEntityType();
  const [{ loading: deleteLoading }, resolveDeleteEntityType] =
    useDeleteEntityType();

  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!resolved) {
      resolveEntityTypes();
      setResolved(true);
    }
  }, [resolved, resolveEntityTypes]);

  const loading =
    entityTypesLoading || createLoading || updateLoading || deleteLoading;

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
        Entity Types
      </Typography>
      {entityTypesError && (
        <Typography color="error">Error: {entityTypesError}</Typography>
      )}

      <CRUDTable
        initialRows={entityTypes as GridRowModel[]}
        loading={loading}
        addButtonText="Add Entity Type"
        recordType="Entity Type"
        defaultFocusField="name"
        DetailComponent={EntityAttributes}
        createColumns={createColumns}
        createPromise={resolveCreateEntityType}
        updatePromise={resolveUpdateEntityType}
        deletePromise={resolveDeleteEntityType}
        getCreatePayload={getCreatePayload}
        getUpdatePayload={getUpdatePayload}
      />
    </Box>
  );
};

export default EntityTypesPresentation;
