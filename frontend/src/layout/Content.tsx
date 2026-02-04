import React from 'react';
import { Box, useTheme } from '@mui/material';

type ContentProps = {
  topbarHeight: number;
  children: React.ReactNode;
  insetRadius?: boolean;
};

const Content: React.FC<ContentProps> = ({ topbarHeight, children, insetRadius = true }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: `calc(100vh - ${topbarHeight}px)`,
        width: '100%',
        backgroundColor: theme.palette.background.default,
        borderTopLeftRadius: insetRadius ? 10 : 0,
        p: { xs: 1, sm: 1.5 },
        overflowX: 'hidden',
      }}
    >
      {children}
    </Box>
  );
};

export default Content;
