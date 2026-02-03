import { Alert, Box, Snackbar } from "@mui/material";
import {
  DataGrid,
  GridRowModesModel,
  GridRowId,
  GridRowModes,
  GridColDef,
  GridRowModel,
  GridEventListener,
  GridRowEditStopReasons,
  GridRow,
  GridRowProps,
  RowPropsOverrides,
} from "@mui/x-data-grid";
import { EditToolbar } from "@components/common/Tables/Toolbars/EditToolbar";
import { useState, useEffect } from "react";
import { detailColumn } from "@components/common/Tables/ActionColumns/DetailColumn";


type CRUDTableProps = {
  initialRows: GridRowModel[];
  loading: boolean;
  defaultFocusField?: string;
  addButtonText?: string;
  recordType?: string;
  DetailComponent?: React.FC<{ params: GridRowProps & RowPropsOverrides }>;
  createColumns: (
    rowModesModel: GridRowModesModel,
    handleSaveClick: (id: GridRowId) => () => void,
    handleCancelClick: (id: GridRowId) => () => void,
    handleEditClick: (id: GridRowId) => () => void,
    handleDeleteClick: (id: GridRowId) => () => void
  ) => GridColDef[];
  createPromise: (payload: any) => Promise<any>;
  updatePromise: (id: number, payload: any) => Promise<any>;
  deletePromise: (id: number) => Promise<void>;
  getCreatePayload: (row: GridRowModel) => any;
  getUpdatePayload: (row: GridRowModel) => any;
};


export const CRUDTable: React.FC<CRUDTableProps> = (props: CRUDTableProps) => {
  const {
    initialRows = [],
    loading = false,
    defaultFocusField,
    addButtonText = "Add record",
    recordType = "Record",
    DetailComponent,
    createColumns,
    createPromise,
    updatePromise,
    deletePromise,
    getCreatePayload,
    getUpdatePayload,
  } = props;
  const [rows, setRows] = useState<GridRowModel[]>(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "success";
  }>({ open: false, message: "", severity: "error" });

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const handleCloseSnackbar = () => {
    setSnackbar((s) => ({ ...s, open: false }));
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel((m) => ({
      ...m,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: defaultFocusField },
    }));
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    try {
      await deletePromise(id as number);
      setRows(rows.filter((row) => row.id !== id));
      setSnackbar({
        open: true,
        message: `${recordType} deleted successfully`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error deleting ${recordType.toLowerCase()}`,
        severity: "error",
      });
    }
  };

  const handleAddClick = () => {
    const id = rows.length > 0 ? Math.max(...rows.map((row) => row.id)) + 1 : 1;
    const stubRow = {
      id,
      isNew: true,
    };
    setRows([stubRow, ...rows]);

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: defaultFocusField },
    }));
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
      handleCancelClick(params.id)();
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    if (newRow.isNew) {
      const payload = getCreatePayload(newRow);

      const newDatabaseRow = await createPromise(payload);

      setRows((rows) =>
        rows.map((r) => (r.id === newRow.id ? newDatabaseRow : r))
      );

      setSnackbar({
        open: true,
        message: `${recordType} created successfully`,
        severity: "success",
      });

      return newDatabaseRow;
    }

    const payload = getUpdatePayload(newRow);

    const updatedDatabaseRow = await updatePromise(newRow.id, payload);

    setRows((rows) =>
      rows.map((r) => (r.id === updatedDatabaseRow.id ? updatedDatabaseRow : r))
    );

    setSnackbar({
      open: true,
      message: `${recordType} updated successfully`,
      severity: "success",
    });

    return updatedDatabaseRow;
  };

  const baseColumns = createColumns(
    rowModesModel,
    handleSaveClick,
    handleCancelClick,
    handleEditClick,
    handleDeleteClick
  );

  const columns = DetailComponent ? [detailColumn, ...baseColumns] : baseColumns;

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleProcessRowUpdateError = (error: any) => {
    setSnackbar({
      open: true,
      message: error.response.data.detail,
      severity: "error",
    });
  };


  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{
          toolbar: EditToolbar,
          row: (params) => {
            const { row, id, ...rest } = params;
            const isOpen = Boolean(row?.__detail__);
            
            return (
              <>
                <GridRow {...rest} row={row} id={id} />
                {isOpen && DetailComponent && (
                  <Box sx={{
                    gridColumn: "1 / -1", 
                    p: 2,
                    m: 2,
                    borderRadius: 2,
                    backgroundColor: "background.default",
                   }}>
                    <DetailComponent params={params}/>
                  </Box>
                )}
              </>
            );
          }
        }}
        slotProps={{
          toolbar: { addButtonText, handleAddClick, rowModesModel },
        }}
      />

      {/* Snackbar for errors/success */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
