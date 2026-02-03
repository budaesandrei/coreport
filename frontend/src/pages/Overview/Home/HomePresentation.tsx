import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Icon from '@mui/material/Icon';
import { useProjectInfo } from '@hooks/useProjectInfo'; // adjust import as needed
import { MuiMarkdown } from 'mui-markdown';
import { Highlight, themes } from 'prism-react-renderer';

type HomePresentationProps = {
  userName: string;
  projectName: string;
};

const HomePresentation: React.FC<HomePresentationProps> = ({ userName, projectName }) => {
  const [
    { data: projectData, loading: projectLoading, error: projectError },
    resolveProject
  ] = useProjectInfo();

  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!resolved && projectName) {
      resolveProject({ name: projectName });
      setResolved(true);
    }
  }, [projectName, resolved, resolveProject]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Welcome, {userName}
      </Typography>
      <Typography variant="subtitle1">
        You're viewing: <strong>{projectName}</strong>
      </Typography>
      <Box mt={3}>
        <Typography color="text.secondary">
          <Icon>add_circle</Icon>
          This is your project overview. Use the sidebar to manage reports, users, and settings.
        </Typography>

        {projectLoading && <Typography>Loading project info...</Typography>}
        {projectError && <Typography color="error">Error: {projectError}</Typography>}
        {projectData && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Project ID: <strong>{projectData.id}</strong><br />
            (Check your network tab for the `X-Project-Id` header!)
          </Typography>
        )}
        <MuiMarkdown Highlight={Highlight} themes={themes} prismTheme={themes.gruvboxMaterialDark}>
          {`~~~python\ndef hello_world():\n    print("Hello, World!")\nhello_world()\n~~~`}
        </MuiMarkdown>
      </Box>
    </Box>
  );
};

export default HomePresentation;
