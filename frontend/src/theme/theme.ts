import { createTheme, ThemeOptions, alpha } from "@mui/material/styles";
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
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        body: {
          backgroundColor: themeParam.palette.background.default,
        },
        ":focus-visible": {
          outline: `2px solid ${alpha(themeParam.palette.primary.main, 0.9)}`,
          outlineOffset: 2,
        },
      }),
    },
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
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.75 : 0.5),
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          padding: "1rem",
          backgroundImage: "none",
          border:
            theme.palette.mode === "dark"
              ? `1px solid ${alpha(theme.palette.divider, 0.6)}`
              : `1px solid ${alpha(theme.palette.divider, 0.25)}`,
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          boxShadow: shadows[2],
          backgroundImage: "none",
          border:
            theme.palette.mode === "dark"
              ? `1px solid ${alpha(theme.palette.divider, 0.6)}`
              : `1px solid ${alpha(theme.palette.divider, 0.25)}`,
        }),
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
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backgroundImage: "none",
          border: "none",
          borderRight: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.6 : 0.35)}`,
          boxShadow: "none",
        }),
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          "&.Mui-selected": {
            backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.22 : 0.12),
            "& .MuiListItemIcon-root, & .MuiTypography-root": {
              color: theme.palette.primary.main,
            },
          },
          "&.Mui-selected:hover": {
            backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.28 : 0.16),
          },
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          fontSize: "0.75rem",
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(grey[900], 0.92)
              : alpha(grey[800], 0.92),
          border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.04)
              : alpha(theme.palette.common.black, 0.02),
          transition: theme.transitions.create(["border-color", "box-shadow", "background-color"], {
            duration: theme.transitions.duration.short,
          }),
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.common.white, 0.06)
                : alpha(theme.palette.common.black, 0.03),
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.9 : 0.8),
            },
          },
          "&.Mui-focused": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.common.white, 0.05)
                : alpha(theme.palette.common.black, 0.02),
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.25)}`,
          },
        }),
        notchedOutline: ({ theme }) => ({
          borderColor: alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.7 : 0.5),
        }),
        input: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.secondary,
          "&.Mui-focused": {
            color: theme.palette.primary.main,
          },
        }),
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
            sortModel: [{ field: "created_at", sort: "asc" }],
          },
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
                .filter((column) => column !== "__detail__");
            },
          },
        },
      },
      styleOverrides: {
        root: {
          border: "none",
          fontSize: "0.7rem",
        },
        columnHeader: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.85 : 1),
          borderBottom: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.6 : 0.35)}`,
          "&:focus": {
            outline: "none",
          },
        }),
        columnHeaderTitle: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontWeight: 700,
        }),
        menuIconButton: ({ theme }) => ({
          color: theme.palette.text.secondary,
        }),
        sortIcon: ({ theme }) => ({
          color: theme.palette.text.secondary,
        }),
        columnSeparator: ({ theme }) => ({
          color: alpha(theme.palette.divider, 0.8),
        }),
        footerContainer: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.85 : 1),
          borderTop: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.6 : 0.35)}`,
          height: "var(--DataGrid-headerHeight)",
          minHeight: "var(--DataGrid-headerHeight)",
        }),
        selectedRowCount: ({ theme }) => ({
          color: theme.palette.text.secondary,
        }),
        virtualScrollerContent: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
        }),
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
        root: ({ theme }) => ({
          fontSize: "0.7rem",
          color: theme.palette.text.secondary,
        }),
        toolbar: {
          height: "var(--DataGrid-headerHeight) !important",
          minHeight: "var(--DataGrid-headerHeight) !important",
          overflow: "hidden",
        },
        selectLabel: ({ theme }) => ({
          color: theme.palette.text.secondary,
        }),
        select: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
        selectIcon: ({ theme }) => ({
          color: theme.palette.text.secondary,
        }),
        displayedRows: ({ theme }) => ({
          color: theme.palette.text.secondary,
        }),
        actions: ({ theme }) => ({
          "& .MuiButtonBase-root": {
            color: theme.palette.text.secondary,
          },
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "0.7rem !important",
          height: "calc(var(--height) - 4px) !important",
        },
      },
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
    divider: grey[300],
    action: {
      hover: alpha("#000", 0.04),
      selected: alpha("#000", 0.06),
      focus: alpha("#2E7C8E", 0.16),
      disabledBackground: alpha("#000", 0.04),
    },
  },
});

export const darkTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: "dark",
    primary: {
      main: "#4FB0C1",
      contrastText: "#0B1218",
    },
    secondary: {
      main: "#152332",
    },
    background: {
      default: "#0E1216",
      paper: "#151B22",
    },
    text: {
      primary: grey[50],
      secondary: grey[300],
    },
    error: {
      main: red[300],
    },
    divider: alpha(grey[600], 0.7),
    action: {
      hover: alpha("#fff", 0.06),
      selected: alpha("#4FB0C1", 0.18),
      focus: alpha("#4FB0C1", 0.28),
      disabledBackground: alpha("#fff", 0.08),
    },
  },
});
