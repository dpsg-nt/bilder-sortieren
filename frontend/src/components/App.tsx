import * as React from 'react';

import { PageContainer } from './Page/PageContainer';
import { PageHeader } from './Page/PageHeader';
import { RoutingAndState } from './RoutingAndState';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  app: {
    backgroundColor: theme.palette.primary.main,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 10px',
    fontSize: '12px',
    color: '#fff',
  },
}));

export const App: React.FC = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.app}>
      <PageContainer>
        <PageHeader title="Bilder Sortieren" />
        <RoutingAndState />
      </PageContainer>
    </div>
  );
};
