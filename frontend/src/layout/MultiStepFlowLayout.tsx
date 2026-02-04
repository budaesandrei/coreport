import * as React from "react";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { Breadcrumbs, type BreadcrumbItem } from "@components/navigation";

export type MultiStepFlowLayoutProps = {
  title: string;
  subtitle?: React.ReactNode;
  breadcrumbs?: {
    items: BreadcrumbItem[];
    currentLabel?: string;
    onNavigate?: (to: string, item: BreadcrumbItem, index: number) => void;
  };
  /** Optional right-aligned content in the header (e.g. actions, status chips). */
  headerAside?: React.ReactNode;
  /** Optional content shown under the header (e.g. step breadcrumbs/stepper). */
  stepper?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  "data-testid"?: string;
};

const MultiStepFlowLayout: React.FC<MultiStepFlowLayoutProps> = ({
  title,
  subtitle,
  breadcrumbs,
  headerAside,
  stepper,
  children,
  maxWidth = "lg",
  "data-testid": dataTestId,
}) => {
  return (
    <div data-testid={dataTestId ?? "multistep-flow-layout"}>
      <Container
        maxWidth={maxWidth}
        sx={{
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {breadcrumbs ? (
          <Box mb={1}>
            <Breadcrumbs
              items={breadcrumbs.items}
              currentLabel={breadcrumbs.currentLabel}
              onNavigate={breadcrumbs.onNavigate}
            />
          </Box>
        ) : null}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "baseline" }}
          justifyContent="space-between"
          gap={1.5}
          mb={2}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>

          {headerAside ? <Box sx={{ flexShrink: 0 }}>{headerAside}</Box> : null}
        </Stack>

        {stepper ? <Box mb={2}>{stepper}</Box> : null}

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
          }}
        >
          {children}
        </Paper>
      </Container>
    </div>
  );
};

export default MultiStepFlowLayout;
