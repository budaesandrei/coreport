import * as React from "react";
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

export type BreadcrumbsProps = {
  /** Items leading up to the current page. */
  items: BreadcrumbItem[];
  /** Optional explicit current label. If omitted, the last item will be treated as current. */
  currentLabel?: string;
  /** Optional handler to override navigation (e.g. analytics + custom navigate). */
  onNavigate?: (to: string, item: BreadcrumbItem, index: number) => void;
  "data-testid"?: string;
};

function splitCrumbs(items: BreadcrumbItem[], currentLabel?: string) {
  if (currentLabel) {
    return { leading: items, current: currentLabel };
  }

  if (items.length === 0) {
    return { leading: [], current: "" };
  }

  const last = items[items.length - 1];
  const leading = items.slice(0, -1);
  return { leading, current: last.label };
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  currentLabel,
  onNavigate,
  "data-testid": dataTestId,
}) => {
  const { leading, current } = splitCrumbs(items, currentLabel);

  return (
    <MUIBreadcrumbs
      aria-label="Breadcrumb"
      data-testid={dataTestId ?? "breadcrumbs"}
      sx={{
        px: 0,
        py: 1,
        "& .MuiBreadcrumbs-separator": { opacity: 0.45 },
      }}
    >
      {leading.map((item, index) => {
        const hasTo = Boolean(item.to);
        const key = `${item.label}-${index}`;

        if (!hasTo) {
          return (
            <Typography key={key} variant="body2" color="text.secondary">
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={key}
            component={RouterLink}
            to={item.to!}
            underline="hover"
            color="text.secondary"
            variant="body2"
            onClick={(e) => {
              if (!onNavigate) return;
              e.preventDefault();
              onNavigate(item.to!, item, index);
            }}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              fontWeight: 500,
            }}
          >
            {item.label}
          </Link>
        );
      })}

      {current ? (
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
          {current}
        </Typography>
      ) : null}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
