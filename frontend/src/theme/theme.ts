import { createTheme, ThemeOptions } from "@mui/material/styles";
import { red, grey } from "@mui/material/colors";
import { Shadows } from "@mui/material/styles/shadows";
import "@mui/x-data-grid/themeAugmentation";
import { GridColDef, GridLoadingOverlay } from "@mui/x-data-grid";

const shadows: Shadows = [
  "none",
  "0px 2px 4px rgba(0, 0, 0, 0.05)",
  "0px 3px 6px rgba(0, 0, 0, 0.07)",
  ...Array(23).fill("0px 4px 8px rgba(0, 0, 0, 0.08)"),
] as Shadows;

const commonThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    h1: { fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: "2rem", fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.3 },
    h4: { fontSize: "1.5rem", fontWeight: 500, lineHeight: 1.4 },
    h5: { fontSize: "1.25rem", fontWeight: 500, lineHeight: 1.5 },
    h6: { fontSize: "1rem", fontWeight: 500, lineHeight: 1.5 },
    subtitle1: { fontSize: "0.95rem", fontWeight: 400 },
    subtitle2: { fontSize: "0.85rem", fontWeight: 400 },
    body1: { fontSize: "0.95rem", lineHeight: 1.6 },
    body2: { fontSize: "0.85rem", lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 600 },
    caption: { fontSize: "0.75rem", fontStyle: "italic" },
    overline: {
      fontSize: "0.7rem",
      letterSpacing: "1px",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows,
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => {
          const color =
            ownerState?.color &&
            ownerState.color !== "inherit" &&
            theme.palette[ownerState.color]
              ? theme.palette[ownerState.color].main
              : theme.palette.primary.main;

          return {
            boxShadow: theme.shadows[7],
            color: theme.palette.getContrastText(color),
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow: theme.shadows[4],
              opacity: 0.9,
            },
          };
        },
        outlined: ({ theme }) => {
          const color = `${theme.palette.secondary.main}`;

          return {
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
            color: theme.palette.getContrastText(color),
            backgroundColor: color,
          };
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "1rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: shadows[2],
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "0.75rem",
          backgroundColor: grey[700],
        },
      },
    },
    MuiDataGrid: {
      defaultProps: {
        density: "compact",
        editMode: "row",
        scrollbarSize: 0,
        showToolbar: true,
        initialState: {
          sorting: {
            sortModel: [{ field: "created_at", sort: "asc"}]
          }
        },
        slots: {
          loadingOverlay: GridLoadingOverlay,
        },
        slotProps: {
          loadingOverlay: {
            variant: "linear-progress",
            noRowsVariant: "skeleton",
          },
          columnsManagement: { 
            getTogglableColumns: (columns: GridColDef[]) => {
              return columns
                .map((column) => column.field)
                .filter((column) => column !== "__detail__")
            } 
          },
        },
      },
      styleOverrides: {
        root: {
          border: "none",
          fontSize: "0.7rem",
        },
        columnHeader: {
          backgroundColor: "#2a3443",
          "&:focus": {
            outline: "none",
          },
        },
        columnHeaderTitle: {
          color: "#ffffff",
        },
        menuIconButton: {
          color: "#ffffff",
        },
        sortIcon: {
          color: "#ffffff",
        },
        columnSeparator: {
          color: "#ffffff",
        },
        footerContainer: {
          backgroundColor: "#2a3443",
          height: "var(--DataGrid-headerHeight)",
          minHeight: "var(--DataGrid-headerHeight)",
        },
        selectedRowCount: {
          color: "#ffffff",
        },
        virtualScrollerContent: ({ theme }) => {
          return {
            backgroundColor: theme.palette.background.paper,
          };
        },
        virtualScrollerRenderZone: {
          position: "relative",
        },
        cell: {
          "&:focus": {
            borderRadius: 8,
          },
        },
        editInputCell: {
          fontWeight: 800,
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          fontSize: "0.7rem"
        },
        toolbar: {
          height: "var(--DataGrid-headerHeight) !important",
          minHeight: "var(--DataGrid-headerHeight) !important",
          overflow: "hidden",
        },
        selectLabel: {
          color: "#ffffff",
        },
        select: {
          color: "#ffffff",
        },
        selectIcon: {
          color: "#ffffff",
        },
        displayedRows: {
          color: "#ffffff",
        },
        actions: {
          "& .MuiButtonBase-root": {
            color: "#ffffff",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "0.7rem !important",
          height: "calc(var(--height) - 4px) !important"
        }
      }
    },
  },
};

export const lightTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: "light",
    primary: {
      main: "#152332",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#2E7C8E",
    },
    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#152332",
      secondary: grey[700],
    },
    error: {
      main: red.A400,
    },
    divider: "#3a465a",
  },
});

export const darkTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: "dark",
    primary: {
      main: "#2E7C8E",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#152332",
    },
    background: {
      default: "#101418",
      paper: "#1B2128",
    },
    text: {
      primary: "#F5F7FA",
      secondary: "#4b596e",
    },
    error: {
      main: red[300],
    },
    divider: "#3a465a",
  },
});
