import * as React from "react";
import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "@components/navigation";

const steps = ["Upload", "Map fields", "Review", "Submit"];

const NewSubmissionWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <Box p={4}>
      <Breadcrumbs
        items={[{ label: "Submissions", to: "/submissions" }]}
        currentLabel="New submission"
        onNavigate={(to) => navigate(to)}
      />

      <Box display="flex" alignItems="baseline" gap={2} mb={2}>
        <Typography variant="h5">New submission</Typography>
        <Typography variant="body2" color="text.secondary">
          (placeholder multi-step flow)
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Step {activeStep + 1}: <strong>{steps[activeStep]}</strong>
        </Typography>

        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={activeStep === steps.length - 1}
          >
            Next
          </Button>
          <Button variant="text" onClick={() => navigate("/submissions")}>
            Back to submissions
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewSubmissionWizardPage;
