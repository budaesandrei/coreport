import { Box, Typography } from "@mui/material";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary">
        This page is scaffolded but not implemented yet.
      </Typography>
    </Box>
  );
}
