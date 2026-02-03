import {
  GridRowModesModel,
  GridRowModes,
  GridRowParams,
  GridRowId,
  GridActionsCellItem,
  GridActionsColDef
} from "@mui/x-data-grid";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";

type ActionsColumnProps = {
  rowModesModel: GridRowModesModel;
  onEdit: (id: GridRowId) => () => void;
  onDelete: (id: GridRowId) => () => void;
  onSave: (id: GridRowId) => () => void;
  onCancel: (id: GridRowId) => () => void;
};

export const createActionsColumn = (props: ActionsColumnProps): GridActionsColDef => {
  const { rowModesModel, onEdit, onDelete, onSave, onCancel } = props;

  return {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    flex: 0.5,
    maxWidth: 100,
    getActions: ({ id }: GridRowParams) => {
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            key="save"
            icon={<Save sx={{ fontSize: "1rem" }} />}
            label="Save"
            onClick={onSave(id)}
            title="Save"
          />,
          <GridActionsCellItem
            key="cancel"
            icon={<Cancel sx={{ fontSize: "1rem" }} />}
            label="Cancel"
            onClick={onCancel(id)}
            title="Cancel"
          />,
        ];
      }
      return [
        <GridActionsCellItem
          key="edit"
          icon={<Edit sx={{ fontSize: "1rem" }} />}
          label="Edit"
          onClick={onEdit(id)}
          title="Edit"
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Delete sx={{ fontSize: "1rem" }} />}
          label="Delete"
          onClick={onDelete(id)}
          title="Delete"
        />,
      ];
    },
  };
};
