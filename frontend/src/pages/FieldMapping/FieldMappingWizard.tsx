import * as React from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MultiStepBreadcrumbItem, MultiStepBreadcrumbs } from "@components/navigation";
import MultiStepFlowLayout from "@layout/MultiStepFlowLayout";

type StepKey = "select" | "map" | "validate";

const stepItems: Array<{ key: StepKey; label: string; description: string }> = [
  { key: "select", label: "Select dataset", description: "Choose a source + target schema." },
  { key: "map", label: "Map fields", description: "Align fields between the two schemas." },
  { key: "validate", label: "Validate", description: "Run basic checks before saving." },
];

const FieldMappingWizard: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);

  const multiStepItems: MultiStepBreadcrumbItem[] = React.useMemo(
    () => stepItems.map((s) => ({ key: s.key, label: s.label })),
    []
  );

  const step = stepItems[activeStep];

  return (
    <MultiStepFlowLayout
      title="Field mapping"
      subtitle="Standardised multi-step layout for mapping flows (placeholder)."
      breadcrumbs={{ items: [{ label: "Setup" }, { label: "Field mapping" }] }}
      headerAside={
        <Button size="small" variant="text" onClick={() => navigate("/")}>
          Back to overview
        </Button>
      }
      stepper={
        <Stack spacing={1}>
          <MultiStepBreadcrumbs
            items={multiStepItems}
            current={activeStep}
            onNavigate={(_, index) => setActiveStep(index)}
          />
          <Divider />
        </Stack>
      }
    >
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {step.label}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {step.description}
      </Typography>

      <Box
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 2,
          backgroundColor: "action.hover",
        }}
      >
        <Typography variant="body2">
          Placeholder mapping UI content for <strong>{step.label}</strong>.
        </Typography>
      </Box>

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
          disabled={activeStep === 0}
        >
          Back
        </Button>

        {activeStep < stepItems.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => setActiveStep((s) => Math.min(stepItems.length - 1, s + 1))}
          >
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={() => navigate("/")}>
            Save mapping
          </Button>
        )}
      </Stack>
    </MultiStepFlowLayout>
  );
};

export default FieldMappingWizard;
