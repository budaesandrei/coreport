import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SubmissionsListPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box p={4}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            Submissions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and review incoming file submissions.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate("/submissions/new")}
          sx={{ alignSelf: { xs: "flex-start", sm: "auto" } }}
        >
          New submission
        </Button>
      </Stack>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Nothing here yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          The submissions table is coming next. For now you can try the new submission flow.
        </Typography>
      </Box>
    </Box>
  );
};

export default SubmissionsListPage;
