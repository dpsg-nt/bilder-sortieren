import React from 'react';
import { CircularProgress, Grid, Typography } from '@mui/material';

export const LoadingScreen: React.FC<{ text: string }> = (props) => (
  <Grid container item alignItems="center" spacing={1}>
    <Grid item>
      <CircularProgress />
    </Grid>
    <Grid item>
      <Typography>{props.text}</Typography>
    </Grid>
  </Grid>
);
