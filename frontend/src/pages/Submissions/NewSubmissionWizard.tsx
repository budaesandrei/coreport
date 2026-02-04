import * as React from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MultiStepBreadcrumbs, type MultiStepBreadcrumbItem } from "@components/navigation";
import MultiStepFlowLayout from "@layout/MultiStepFlowLayout";

type StepKey = "upload" | "map" | "review" | "submit";

const stepItems: Array<{ key: StepKey; label: string; description: string }> = [
  { key: "upload", label: "Upload", description: "Choose a file to submit." },
  { key: "map", label: "Map fields", description: "Confirm or edit field mapping." },
  { key: "review", label: "Review", description: "Verify metadata and checks." },
  { key: "submit", label: "Submit", description: "Send to approvers." },
];

const NewSubmissionWizard: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);

  const multiStepItems: MultiStepBreadcrumbItem[] = React.useMemo(
    () => stepItems.map((s) => ({ key: s.key, label: s.label })),
    []
  );

  const step = stepItems[activeStep];

  return (
    <MultiStepFlowLayout
      title="New submission"
      subtitle="Placeholder multi-step flow to validate the standard multi-step layout."
      breadcrumbs={{
        items: [{ label: "Submissions", to: "/submissions" }],
        currentLabel: "New submission",
      }}
      headerAside={
        <Button size="small" variant="text" onClick={() => navigate("/submissions")}>
          Back to submissions
        </Button>
      }
      stepper={
        <Stack spacing={1}>
          <MultiStepBreadcrumbs
            items={multiStepItems}
            current={activeStep}
            onNavigate={(_, index) => setActiveStep(index)}
            ariaLabel="Step progress"
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
          Placeholder content for <strong>{step.label}</strong>.
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
          <Button variant="contained" onClick={() => navigate("/submissions")}>
            Finish
          </Button>
        )}
      </Stack>
    </MultiStepFlowLayout>
  );
};

export default NewSubmissionWizard;
