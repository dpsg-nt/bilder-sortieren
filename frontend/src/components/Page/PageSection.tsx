import React, { PropsWithChildren } from 'react';

import { Grid, Paper } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme, props) => ({
  paper: {
    padding: theme.spacing(2),
  },
}));

export const PageSection: React.FC<{ maxWidth?: string } & PropsWithChildren> = (props) => {
  const { classes } = useStyles();
  return (
    <Grid item xs={12} style={{ maxWidth: props.maxWidth ?? '600px' }}>
      <Paper elevation={1} className={classes.paper}>
        <Grid container direction="column" spacing={2}>
          {props.children}
        </Grid>
      </Paper>
    </Grid>
  );
};
