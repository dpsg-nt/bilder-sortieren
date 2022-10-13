import useAxios from 'axios-hooks';
import { YearsResponse } from '../../data/api';
import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { LoadingScreen } from '../Helper/LoadingScreen';

export const SelectYear: React.FC<{ onSelect: (year: string) => void }> = (props) => {
  const [response] = useAxios<YearsResponse>({
    url: 'http://localhost:3002/years',
  });

  return response.loading ? (
    <LoadingScreen text="Jahre werden geladen..." />
  ) : (
    <>
      <Grid item>
        <Typography>Wähle das Jahr in dem die Aktion stattgefunden hat:</Typography>
      </Grid>
      <Grid container item direction="column">
        {response.data &&
          response.data.map((year) => (
            <Grid item key={year}>
              <Button onClick={() => props.onSelect(year)}>{year}</Button>
            </Grid>
          ))}
      </Grid>
    </>
  );
};
