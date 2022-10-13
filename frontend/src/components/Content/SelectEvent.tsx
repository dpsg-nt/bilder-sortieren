import useAxios from 'axios-hooks';
import { EventsResponse } from '../../data/api';
import React from 'react';
import { LoadingScreen } from '../Helper/LoadingScreen';
import { Button, Grid, Typography } from '@mui/material';

export const SelectEvent: React.FC<{ year: string; onSelect: (event: string) => void }> = (props) => {
  const [response] = useAxios<EventsResponse>({
    url: `http://localhost:3002/events?year=${encodeURIComponent(props.year)}`,
  });

  return response.loading ? (
    <LoadingScreen text="Aktionen werden geladen..." />
  ) : (
    <>
      <Grid item>
        <Typography>Wähle die Aktion aus von der du Bilder aussortieren möchtest:</Typography>
      </Grid>
      <Grid container item direction="column">
        {response.data &&
          response.data.map((event) => (
            <Grid item key={event}>
              <Button onClick={() => props.onSelect(event)}>{event}</Button>
            </Grid>
          ))}
      </Grid>
    </>
  );
};
