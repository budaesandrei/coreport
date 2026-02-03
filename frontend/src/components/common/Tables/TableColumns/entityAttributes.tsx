import { GridColDef, GridRowModesModel, GridRowId } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { createActionsColumn } from "@components/common/Tables/ActionColumns/EDSCActions";



export const createColumns = (
  rowModesModel: GridRowModesModel,
  handleSaveClick: (id: GridRowId) => () => void,
  handleCancelClick: (id: GridRowId) => () => void,
  handleEditClick: (id: GridRowId) => () => void,
  handleDeleteClick: (id: GridRowId) => () => void,
): GridColDef[] => {
  const actionsColumn = createActionsColumn({
    rowModesModel,
    onSave: handleSaveClick,
    onCancel: handleCancelClick,
    onEdit: handleEditClick,
    onDelete: handleDeleteClick,
  });

  return [
    actionsColumn,
    {
      field: "attribute_order",
      headerName: "Order",
      type: "number",
      align: "right",
      headerAlign: "right",
      editable: true,
      flex: 0.2,
    },
    {
      field: "name",
      headerName: "Name",
      type: "string",
      align: "left",
      headerAlign: "left",
      editable: true,
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      type: "string",
      align: "left",
      headerAlign: "left",
      editable: true,
      flex: 1,
    },
    {
      field: "is_primary",
      headerName: "Primary",
      type: "boolean",
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 0.5,
      renderCell: ({ value }) => {
        return (
          <Chip
            label={value ? "PK" : ""}
            size="small"
            variant="outlined"
            color={value ? "success" : "default"}
            sx={{ fontSize: "0.7rem" }}
          />
        );
      },
    },
    {
      field: "type",
      headerName: "Type",
      type: "string",
      align: "right",
      headerAlign: "right",
      editable: true,
      flex: 0.5,

    },
    {
      field: "required",
      headerName: "Required",
      type: "boolean",
      align: "right",
      headerAlign: "right",
      editable: true,
      flex: 1,
    },
  ];
};
