import {
  GridColDef,
  GridRowModesModel,
  GridRowId,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import moment from "moment";
import { createActionsColumn } from "@components/common/Tables/ActionColumns/EDSCActions";
import { ProjectRole, UserStatus } from "@types";
import { Chip, MenuItem, TextField } from "@mui/material";
import { AdminPanelSettings, Publish, TaskAlt, Face, PersonPin, PersonOff, ScheduleSend } from "@mui/icons-material";

export const createColumns = (
  rowModesModel: GridRowModesModel,
  handleSaveClick: (id: GridRowId) => () => void,
  handleCancelClick: (id: GridRowId) => () => void,
  handleEditClick: (id: GridRowId) => () => void,
  handleDeleteClick: (id: GridRowId) => () => void,
  providerOptions: string[]
): GridColDef[] => {
  const actionsColumn = createActionsColumn({
    rowModesModel,
    onSave: handleSaveClick,
    onCancel: handleCancelClick,
    onEdit: handleEditClick,
    onDelete: handleDeleteClick,
  });

  const userStatusConfig = {
    [UserStatus.ACTIVE]: {
      label: "Active",
      color: "success",
      variant: "filled",
      icon: <PersonPin />
    },
    [UserStatus.DEACTIVATED]: {
      label: "Deactivated",
      color: "error",
      variant: "outlined",
      icon: <PersonOff />
    },
    [UserStatus.SUSPENDED]: {
      label: "Suspended",
      color: "warning",
      variant: "outlined",
    },
    [UserStatus.INVITED]: {
      label: "Invited",
      color: "info",
      variant: "outlined",
      icon: <ScheduleSend />
    },
  } as any;

  const projectRoleConfig = {
    [ProjectRole.PROJECT_ADMIN]: {
      label: "Admin",
      color: "primary",
      variant: "filled",
      icon: <AdminPanelSettings />,
    },
    [ProjectRole.REPORT_SUBMITTER]: {
      label: "Submitter",
      color: "divider",
      variant: "filled",
      icon: <Publish />,
    },
    [ProjectRole.REPORT_APPROVER]: {
      label: "Approver",
      color: "success",
      variant: "outlined",
      icon: <TaskAlt />
    },
    [ProjectRole.VIEWER]: {
      label: "Viewer",
      color: "info",
      variant: "outlined",
      icon: <Face />
    },
  } as any;

  return [
    actionsColumn,
    {
      field: "first_name",
      headerName: "First Name",
      type: "string",
      align: "left",
      headerAlign: "left",
      editable: true,
      flex: 1,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      type: "string",
      align: "left",
      headerAlign: "left",
      editable: true,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      editable: true,
      flex: 1,
      renderCell: ({ value }) => <strong>{value}</strong>,
      renderEditCell: (params: GridRenderEditCellParams) => {
        const { id, field, value, api, row } = params;
    
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          api.setEditCellValue(
            { id, field, value: e.target.value },
            e
          );
        };
    
        const handleBlur = () => {
          api.stopCellEditMode({ id, field });
        };
    
        return (
          <TextField
            value={value ?? ""}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            disabled={!row.isNew}
          />
        );
      },
    },
    {
      field: "provider_name",
      headerName: "Provider Name",
      type: "singleSelect",
      align: "left",
      headerAlign: "left",
      editable: true,
      flex: 0.7,
      valueOptions: providerOptions,
      renderEditCell: (params: GridRenderEditCellParams) => {
        const { id, field, value, api, row } = params;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          api.setEditCellValue({ id, field, value: e.target.value }, e);
        };
      
        const handleBlur = () => {
          api.stopCellEditMode({ id, field });
        };

        return (
          <TextField
            select
            value={value ?? ""}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={
              row?.isNew
                ? true
                : false
            }
            fullWidth
          >
            {providerOptions.map((option: string) => (
              <MenuItem value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      type: "singleSelect",
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 0.7,
      valueOptions: Object.keys(userStatusConfig),
      renderCell: ({ value }) => {
        return (
          <Chip {...userStatusConfig[value]} size="small" sx={{ fontSize: "0.7rem" }} />
        );
      },
      renderEditCell: (params: GridRenderEditCellParams) => {
        const { id, field, value, api, row } = params;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          api.setEditCellValue({ id, field, value: e.target.value }, e);
        };
      
        const handleBlur = () => {
          api.stopCellEditMode({ id, field });
        };

        return (
          <TextField
            select
            defaultValue={UserStatus.INVITED}
            value={value ?? UserStatus.INVITED}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={
              value === UserStatus.INVITED || row?.isNew
                ? true
                : false
            }
            fullWidth
          >
            {Object.keys(userStatusConfig).map((option: string) => (
              <MenuItem value={option} disabled={option === UserStatus.INVITED}>
                {userStatusConfig[option].label}
              </MenuItem>
            ))}
          </TextField>
        );
      },
    },
    {
      field: "role",
      headerName: "Role",
      type: "singleSelect",
      align: "center",
      headerAlign: "center",
      editable: true,
      flex: 0.7,
      valueOptions: Object.keys(projectRoleConfig),
      renderCell: ({ value }) => {
        return (
          <Chip {...projectRoleConfig[value]} size="small" sx={{ fontSize: "0.7rem" }} />
        );
      },
      renderEditCell: (params: GridRenderEditCellParams) => {
        const { id, field, value, api } = params;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          api.setEditCellValue({ id, field, value: e.target.value }, e);
        };
      
        const handleBlur = () => {
          api.stopCellEditMode({ id, field });
        };

        return (
          <TextField
            select
            fullWidth
            defaultValue={ProjectRole.VIEWER}
            value={value ?? ProjectRole.VIEWER}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            {Object.keys(projectRoleConfig).map((option: string) => (
              <MenuItem value={option} dense>
                {projectRoleConfig[option].label}
              </MenuItem>
            ))}
          </TextField>
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
