import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Icon from '@mui/material/Icon';
import { useWorkspaceInfo } from '@hooks/useWorkspaceInfo';

type HomePresentationProps = {
  userName: string;
  workspaceName: string;
};

const HomePresentation: React.FC<HomePresentationProps> = ({ userName, workspaceName }) => {
  const [
    { data: workspaceData, loading: workspaceLoading, error: workspaceError },
    resolveWorkspace
  ] = useWorkspaceInfo();

  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!resolved && workspaceName) {
      resolveWorkspace({ name: workspaceName });
      setResolved(true);
    }
  }, [workspaceName, resolved, resolveWorkspace]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Welcome, {userName}
      </Typography>
      <Typography variant="subtitle1">
        You're viewing: <strong>{workspaceName}</strong>
      </Typography>
      <Box mt={3}>
        <Typography color="text.secondary">
          <Icon>add_circle</Icon>
          This is your project overview. Use the sidebar to manage reports, users, and settings.
        </Typography>

        {workspaceLoading && <Typography>Loading workspace info...</Typography>}
        {workspaceError && <Typography color="error">Error: {workspaceError}</Typography>}
        {workspaceData && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Workspace ID: <strong>{workspaceData.id}</strong>
            <br />
            Workspace Slug: <strong>{workspaceData.slug}</strong>
            <br />
            (Requests include the `X-Workspace-Id` header.)
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default HomePresentation;
