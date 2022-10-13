import * as React from 'react';

import { Logo } from '../Logo/Logo';
import { Grid, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => ({
  header: {
    display: 'flex',
    justifyContent: 'center',
  },
  logo: {
    width: '80vw',
    maxWidth: '200px',
  },
}));

export const PageHeader: React.FC<{ title: string }> = (props) => {
  const { classes } = useStyles();
  return (
    <Grid item xs={12}>
      <div className={classes.header}>
        <Logo className={classes.logo} />
        <Typography variant="h3">{props.title}</Typography>
      </div>
    </Grid>
  );
};
