import { GridRowModesModel, GridRowParams } from "@mui/x-data-grid";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    addButtonText: string;
    handleAddClick: () => void;
    rowModesModel: GridRowModesModel;
  }
}