import * as React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Breadcrumbs, BreadcrumbItem } from "@components/navigation";

export type MultiStepFlowLayoutProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: {
    items: BreadcrumbItem[];
    currentLabel?: string;
    onNavigate?: (to: string, item: BreadcrumbItem, index: number) => void;
  };
  headerAside?: React.ReactNode;
  /** Optional node rendered below the header (commonly: step breadcrumbs/stepper). */
  stepper?: React.ReactNode;
  children: React.ReactNode;
};

const MultiStepFlowLayout: React.FC<MultiStepFlowLayoutProps> = ({
  title,
  subtitle,
  breadcrumbs,
  headerAside,
  stepper,
  children,
}) => {
  return (
    <Box p={4}>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {breadcrumbs ? (
          <Breadcrumbs
            items={breadcrumbs.items}
            currentLabel={breadcrumbs.currentLabel}
            onNavigate={breadcrumbs.onNavigate}
          />
        ) : null}

        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Box>
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Box>

          {headerAside}
        </Stack>

        {stepper}
      </Stack>

      {children}
    </Box>
  );
};

export default MultiStepFlowLayout;
