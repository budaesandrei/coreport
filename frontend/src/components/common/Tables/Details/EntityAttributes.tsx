import { GridRowProps, RowPropsOverrides } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { useListEntityAttributes } from "@hooks/EntityAttributes/useListEntityAttributes";
import { useCreateEntityAttribute } from "@hooks/EntityAttributes/useCreateEntityAttribute";
import { useUpdateEntityAttribute } from "@hooks/EntityAttributes/useUpdateEntityAttribute";
import { useDeleteEntityAttribute } from "@hooks/EntityAttributes/useDeleteEntityAttribute";
import { useState, useEffect, useCallback } from "react";
import { GridRowModel } from "@mui/x-data-grid";
import { createColumns } from "@components/common/Tables/TableColumns/entityAttributes";
import { CRUDTable } from "@components/common/Tables/Table/CRUDTable";


export const EntityAttributes: React.FC<{ params: GridRowProps & RowPropsOverrides }> = ({ params }) => {
  const [
    { data: entityAttributes, loading: entityAttributesLoading, error: entityAttributesError },
    resolveEntityAttributes,
  ] = useListEntityAttributes();
  const [{ loading: createLoading }, resolveCreateEntityAttribute] =
    useCreateEntityAttribute();
  const [{ loading: updateLoading }, resolveUpdateEntityAttribute] =
    useUpdateEntityAttribute();
  const [{ loading: deleteLoading }, resolveDeleteEntityAttribute] =
    useDeleteEntityAttribute();

  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!resolved) {
      resolveEntityAttributes(params.row.id);
      setResolved(true);
    }
  }, [resolved, resolveEntityAttributes]);

  const loading =
    entityAttributesLoading || createLoading || updateLoading || deleteLoading;

  const getCreatePayload = (row: GridRowModel) => {
    return {
      name: row.name,
      description: row.description,
      is_primary: row.is_primary,
      type: row.type,
      required: row.required,
      attribute_order: row.attribute_order,
    };
  };

  const getUpdatePayload = (row: GridRowModel) => {
    return {
      name: row.name,
      description: row.description,
      is_primary: row.is_primary,
      type: row.type,
      required: row.required,
      attribute_order: row.attribute_order,
    };
  };

  const createPromise = useCallback(
    (
      payload: any
    ) => {
      return resolveCreateEntityAttribute(
        params.row.id,
        payload
      );
    },
    [params.row.id]
  );

  const updatePromise = useCallback(
    (
      id: number,
      payload: any
    ) => {
      return resolveUpdateEntityAttribute(
        params.row.id,
        id,
        payload
      );
    },
    [params.row.id]
  );

  const deletePromise = useCallback(
    (
      id: number,
    ) => {
      return resolveDeleteEntityAttribute(
        params.row.id,
        id,
      );
    },
    [params.row.id]
  );


  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Attributes <strong>({params.row.name})</strong>
      </Typography>
      {entityAttributesError && (
        <Typography color="error">Error: {entityAttributesError}</Typography>
      )}

      <CRUDTable
        initialRows={entityAttributes as GridRowModel[]}
        loading={loading}
        addButtonText="Add Entity Attribute"
        recordType="Entity Attribute"
        defaultFocusField="name"
        createColumns={createColumns}
        createPromise={createPromise}
        updatePromise={updatePromise}
        deletePromise={deletePromise}
        getCreatePayload={getCreatePayload}
        getUpdatePayload={getUpdatePayload}
      />
    </Box>
  );
};