import { GridColDef } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

export const detailColumn: GridColDef = {
  field: "__detail__",
  headerName: "",
  type: "boolean",
  align: "left",
  headerAlign: "left",
  disableColumnMenu: true,
  sortable: false,
  filterable: false,
  resizable: false,
  editable: false,
  hideable: false,
  disableExport: true,
  width: 50,
  renderCell: ({ row, api }) => {
    const isOpen = Boolean(row.__detail__);

    const handleClick = () => {
      api.updateRows([{ id: row.id, __detail__: !isOpen }]);
    }

    return (
      <IconButton size="small" onClick={handleClick}>
        {isOpen ? <Remove sx={{ fontSize: "1rem" }}/> : <Add sx={{ fontSize: "1rem" }}/>}
      </IconButton>
    );
  },
};