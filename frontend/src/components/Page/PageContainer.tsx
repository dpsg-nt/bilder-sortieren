import React, { PropsWithChildren } from 'react';

import { Container, Grid } from '@mui/material';

export const PageContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container>
      <Grid container spacing={4} justifyContent="center">
        {children}
      </Grid>
    </Container>
  );
};
