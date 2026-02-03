import { GridColDef, GridRowModesModel, GridRowId } from "@mui/x-data-grid";
import moment from "moment";
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
      field: "is_active",
      headerName: "Active",
      type: "boolean",
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 0.5,
      renderCell: ({ value }) => {
        return (
          <Chip
            label={value ? "Active" : "Inactive"}
            size="small"
            variant="outlined"
            color={value ? "success" : "error"}
            sx={{ fontSize: "0.7rem" }}
          />
        );
      },
    },
    {
      field: "created_at",
      headerName: "Created At",
      type: "date",
      align: "right",
      headerAlign: "right",
      editable: false,
      flex: 0.5,
      valueGetter: (value: string) => {
        return moment(value).utc().toDate();
      },
    },
    {
      field: "created_by",
      headerName: "Created By",
      type: "string",
      align: "right",
      headerAlign: "right",
      editable: false,
      flex: 1,
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      type: "date",
      align: "right",
      headerAlign: "right",
      editable: false,
      flex: 0.5,
      valueGetter: (value: string) => {
        return moment(value).utc().toDate();
      },
    },
    {
      field: "updated_by",
      headerName: "Updated By",
      type: "string",
      align: "right",
      headerAlign: "right",
      editable: false,
      flex: 1,
    },
  ];
};
