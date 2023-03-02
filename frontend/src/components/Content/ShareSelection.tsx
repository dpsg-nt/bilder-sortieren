import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { PictureStatus } from './SelectImages';
import { Image } from '../../data/api';
import React from 'react';

export const ShareSelection: React.FC<{
  event: string;
  images: Image[];
  pictureStatus: { [key: string]: PictureStatus };
  open: boolean;
  onClose: () => void;
}> = (props) => {
  const subject = `Bilder-Auswahl für ${props.event}`;
  const body = `Link zur Auswahl:\n${window.location.href}`;
  const mailToLink = `mailto:bilder@dpsg-nuertingen.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body
  )}`;
  const exportImageSelection = () => {
    const selectedImageNames = props.images
      .filter((image) => props.pictureStatus[image.id] === 'approved')
      .map((image) => `${image.name}`);

    navigator.clipboard.writeText(selectedImageNames.join('\n'));
  };
  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth>
      <DialogTitle>Geteiler Link</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography>Die Auswahl kann als Link geteilt werden.</Typography>
          </Grid>
          <Grid item>
            <TextField label="Aktuelle Auswahl als Link" value={window.location.href} disabled fullWidth />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={exportImageSelection}>
          Export
        </Button>
        <Button variant="contained" onClick={() => window.open(mailToLink)}>
          Per Email teilen
        </Button>
        <Button onClick={() => navigator.clipboard.writeText(window.location.href)}>Link kopieren</Button>
        <Button onClick={props.onClose}>Schließen</Button>
      </DialogActions>
    </Dialog>
  );
};
