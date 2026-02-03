import {
  Tooltip,
  TextField,
  InputAdornment,
  styled,
  Box,
  Button,
} from "@mui/material";
import {
  GridSlotProps,
  ToolbarButton,
  Toolbar,
  FilterPanelTrigger,
  QuickFilter,
  QuickFilterTrigger,
  QuickFilterControl,
  QuickFilterClear,
  ColumnsPanelTrigger,
  GridRowModes
} from "@mui/x-data-grid";
import {
  Add,
  ViewColumn,
  FilterList,
  Search,
  Cancel,
} from "@mui/icons-material";

type OwnerState = {
  expanded: boolean;
};

const StyledDefaultToolbarItems = styled(Box)({
  marginRight: "auto",
  display: "flex",
  gap: 10,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
});

const StyledQuickFilter = styled(QuickFilter)({
  display: "grid",
  alignItems: "center",
  marginRight: "auto",
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: "1 / 1",
    width: "min-content",
    height: "min-content",
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? "none" : "auto",
    transition: theme.transitions.create(["opacity"]),
  })
);

const StyledTextField = styled(TextField)<{
  ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
  gridArea: "1 / 1",
  overflowX: "clip",
  width: ownerState.expanded ? 260 : "var(--trigger-width)",
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(["width", "opacity"]),
}));

export const EditToolbar = (props: GridSlotProps["toolbar"]) => {
  const { addButtonText, handleAddClick, rowModesModel } = props;
  const disabled = Object.values(rowModesModel).length > 0 ? Object.values(rowModesModel)[0].mode === GridRowModes.Edit : false;

  return (
    <Toolbar>
      <StyledDefaultToolbarItems>
        <Tooltip title="Columns">
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <ViewColumn fontSize="small" />
          </ColumnsPanelTrigger>
        </Tooltip>
        <Tooltip title="Filter">
          <FilterPanelTrigger render={<ToolbarButton />}>
            <FilterList fontSize="small" />
          </FilterPanelTrigger>
        </Tooltip>
        <StyledQuickFilter>
          <QuickFilterTrigger
            render={(triggerProps, state) => (
              <Tooltip title="Search" enterDelay={0}>
                <StyledToolbarButton
                  {...triggerProps}
                  ownerState={{ expanded: state.expanded }}
                  color="default"
                  aria-disabled={state.expanded}
                >
                  <Search fontSize="small" />
                </StyledToolbarButton>
              </Tooltip>
            )}
          />
          <QuickFilterControl
            render={({ ref, ...controlProps }, state) => (
              <StyledTextField
                {...controlProps}
                ownerState={{ expanded: state.expanded }}
                inputRef={ref}
                aria-label="Search"
                placeholder="Search..."
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: state.value ? (
                      <InputAdornment position="end">
                        <QuickFilterClear
                          edge="end"
                          size="small"
                          aria-label="Clear search"
                        >
                          <Cancel fontSize="small" />
                        </QuickFilterClear>
                      </InputAdornment>
                    ) : null,
                    ...controlProps.slotProps?.input,
                  },
                  ...controlProps.slotProps,
                }}
              />
            )}
          />
        </StyledQuickFilter>
      </StyledDefaultToolbarItems>

      <Tooltip title="Add record">
        <ToolbarButton
          onClick={handleAddClick}
          color="primary"
          render={() => (
            <Button
              variant="outlined"
              endIcon={<Add fontSize="large" />}
              onClick={handleAddClick}
              disabled={disabled}
            >
              {addButtonText}
            </Button>
          )}
        />
      </Tooltip>
    </Toolbar>
  );
};
