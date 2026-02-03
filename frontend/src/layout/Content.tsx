import React from 'react';
import { Box, useTheme } from '@mui/material';

type ContentProps = {
  topbarHeight: number;
  children: React.ReactNode;
};

const Content: React.FC<ContentProps> = ({ topbarHeight, children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: `calc(100vh - ${topbarHeight}px)`,
        width: '100%',
        backgroundColor: theme.palette.background.default,
        borderTopLeftRadius: 10,
        p: 1,
      }}
    >
      {children}
    </Box>
  );
};

export default Content;
