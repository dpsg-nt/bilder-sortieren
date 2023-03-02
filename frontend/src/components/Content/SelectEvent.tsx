import useAxios from 'axios-hooks';
import { AuswahlResponse, EventsResponse } from '../../data/api';
import React from 'react';
import { LoadingScreen } from '../Helper/LoadingScreen';
import { Button, Grid, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const SelectEvent: React.FC<{ year: string; onSelect: (event: string) => void }> = (props) => {
  const [response] = useAxios<EventsResponse>({
    url: `events?year=${encodeURIComponent(props.year)}`,
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
              <Button onClick={() => props.onSelect(event)}>
                {event} <EventSortedCheckMark year={props.year} event={event} />
              </Button>
            </Grid>
          ))}
      </Grid>
    </>
  );
};

const EventSortedCheckMark: React.FC<{ year: string; event: string }> = (props) => {
  const params = `year=${encodeURIComponent(props.year)}&event=${encodeURIComponent(props.event)}`;
  const [auswahlResponse] = useAxios<AuswahlResponse>({ url: `auswahl?${params}` });

  return (auswahlResponse.data?.approved?.length ?? 0) > 0 ? (
    <>
      &nbsp;
      <CheckCircleOutlineIcon fontSize="small" />
    </>
  ) : null;
};
