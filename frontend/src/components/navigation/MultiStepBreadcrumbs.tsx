import * as React from "react";
import {
  Box,
  Breadcrumbs as MUIBreadcrumbs,
  Link as MuiLink,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export type MultiStepBreadcrumbItem = {
  key: string;
  label: string;
};

export type MultiStepBreadcrumbsProps = {
  items: MultiStepBreadcrumbItem[];
  /** Current step index (0-based) or step key. */
  current: number | string;
  /** Optional click handler for navigation (commonly: go back to a prior step). */
  onNavigate?: (item: MultiStepBreadcrumbItem, index: number) => void;
  /** If true, clicking steps ahead of current is allowed. Defaults to false. */
  allowForwardNavigation?: boolean;
  ariaLabel?: string;
  "data-testid"?: string;
};

const getCurrentIndex = (items: MultiStepBreadcrumbItem[], current: number | string) => {
  if (typeof current === "number") return Math.max(0, Math.min(items.length - 1, current));
  const idx = items.findIndex((i) => i.key === current);
  return idx >= 0 ? idx : 0;
};

const MultiStepBreadcrumbs: React.FC<MultiStepBreadcrumbsProps> = ({
  items,
  current,
  onNavigate,
  allowForwardNavigation = false,
  ariaLabel = "Step progress",
  "data-testid": dataTestId,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const currentIndex = React.useMemo(() => getCurrentIndex(items, current), [items, current]);

  const isClickable = (index: number) => {
    if (!onNavigate) return false;
    if (allowForwardNavigation) return index !== currentIndex;
    return index < currentIndex;
  };

  // Mobile: show previous + current only.
  const visibleItems = React.useMemo(() => {
    if (!isSmall) return items.map((item, index) => ({ item, index }));

    const currentItem = { item: items[currentIndex], index: currentIndex };
    if (currentIndex > 0) {
      return [{ item: items[currentIndex - 1], index: currentIndex - 1 }, currentItem];
    }

    return [currentItem];
  }, [isSmall, items, currentIndex]);

  if (items.length === 0) return null;

  return (
    <Box sx={{ width: "100%", overflowX: "auto", pb: 0.5, WebkitOverflowScrolling: "touch" }}>
      <MUIBreadcrumbs
        aria-label={ariaLabel}
        data-testid={dataTestId ?? "multi-step-breadcrumbs"}
        sx={{
          whiteSpace: "nowrap",
          fontSize: 13,
          color: "text.secondary",
          "& .MuiBreadcrumbs-separator": { mx: 0.75, opacity: 0.45 },
        }}
      >
        {visibleItems.map(({ item, index }) => {
          const isCurrent = index === currentIndex;

          if (!isCurrent && isClickable(index)) {
            return (
              <MuiLink
                key={item.key}
                component="button"
                type="button"
                onClick={() => onNavigate?.(item, index)}
                underline="none"
                color="text.secondary"
                sx={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  p: 0,
                  m: 0,
                  textAlign: "left",
                  fontWeight: 500,
                  "&:hover": { color: "text.primary" },
                }}
              >
                {item.label}
              </MuiLink>
            );
          }

          return (
            <Typography
              key={item.key}
              color={isCurrent ? "text.primary" : "text.secondary"}
              sx={{
                fontWeight: isCurrent ? 700 : 500,
                maxWidth: isSmall ? "65vw" : "none",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.label}
            </Typography>
          );
        })}
      </MUIBreadcrumbs>
    </Box>
  );
};

export default MultiStepBreadcrumbs;
