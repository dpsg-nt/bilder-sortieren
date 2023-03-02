import useAxios from 'axios-hooks';
import { Image, ImagesResponse, AuswahlResponse } from '../../data/api';
import React, { useState } from 'react';
import { SelectableImage } from './SelectableImage';
import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { LoadingScreen } from '../Helper/LoadingScreen';
import axios from 'axios';

type Filter = 'all' | 'approved' | 'rejected' | 'undecided';
export type PictureStatus = 'approved' | 'rejected' | 'undecided';

export const SelectImages: React.FC<{
  year: string;
  event: string;
}> = (props) => {
  const [localAuswahl, setLocalAuswahl] = useState<AuswahlResponse>({ approved: [], rejected: [] });
  const [highlightedImage, setHighlightedImage] = useState<Image>();
  const [filter, setFilter] = useState<Filter>('all');
  const [auswahlImported, setAuswahlImported] = useState(false);
  const [changesSinceLastSave, setChangesSinceLastSave] = useState(false);

  const params = `year=${encodeURIComponent(props.year)}&event=${encodeURIComponent(props.event)}`;

  const [response] = useAxios<ImagesResponse>({ url: `images?${params}` });
  const [auswahlResponse] = useAxios<AuswahlResponse>({ url: `auswahl?${params}` });

  const filteredAndSortedImages: Image[] = response.data
    ? response.data
        .filter(
          (image) =>
            filter === 'all' ||
            (filter === 'approved' && localAuswahl.approved.includes(image.name)) ||
            (filter === 'rejected' && localAuswahl.rejected.includes(image.name)) ||
            (filter === 'undecided' &&
              !localAuswahl.approved.includes(image.name) &&
              !localAuswahl.rejected.includes(image.name))
        )
        .sort((a, b) => (a.captureDate ?? 'z').localeCompare(b.captureDate ?? 'z'))
    : [];

  const serverAuswahl: AuswahlResponse = React.useMemo(() => {
    if (auswahlResponse?.data) {
      const auswahl = { approved: [...auswahlResponse?.data.approved], rejected: [...auswahlResponse?.data.rejected] };
      auswahl.approved.sort();
      auswahl.rejected.sort();
      return auswahl;
    } else {
      return { approved: [], rejected: [] };
    }
  }, [auswahlResponse]);

  const showImage = (image: Image) => {
    setHighlightedImage(image);
  };

  const onNewStatus = (image: Image, newStatus: PictureStatus) => {
    const newAuswahl: AuswahlResponse = {
      approved: localAuswahl.approved.filter((name) => image.name !== name),
      rejected: localAuswahl.rejected.filter((name) => image.name !== name),
    };
    switch (newStatus) {
      case 'approved':
        newAuswahl.approved.push(image.name);
        break;
      case 'rejected':
        newAuswahl.rejected.push(image.name);
        break;
      case 'undecided':
        break;
    }
    setLocalAuswahl(newAuswahl);
    setChangesSinceLastSave(true);
  };

  const loadSharedAuswahl = () => {
    setLocalAuswahl({ approved: [...serverAuswahl.approved], rejected: [...serverAuswahl.rejected] });
    setAuswahlImported(true);
  };

  const saveAuswahl = async () => {
    await axios.post(`auswahl?${params}`, localAuswahl);
    setChangesSinceLastSave(false);
  };

  return response.loading || !response.data ? (
    <LoadingScreen text="Bilder werden geladen..." />
  ) : (
    <>
      <Dialog open={highlightedImage !== undefined} onClose={() => setHighlightedImage(undefined)} maxWidth="lg">
        <DialogContent onClick={() => setHighlightedImage(undefined)}>
          <img
            src={highlightedImage?.full}
            alt={highlightedImage?.name}
            style={{ maxHeight: '80vh', maxWidth: '100%' }}
          />
        </DialogContent>
      </Dialog>
      <Grid item>
        <Typography variant="h5">Auswahl für "{props.event}"</Typography>
      </Grid>
      <Grid item>
        <Typography>
          Entscheide jetzt für jedes Bild ob es zur Auswahl hinzugefügt werden soll ("Auswählen"), oder ob es nicht
          hinzugefügt werden soll ("Ablehnen").
        </Typography>
      </Grid>
      <Grid item container justifyContent="space-between">
        <Grid item>
          <FormControl sx={{ width: '250px' }} size="small">
            <InputLabel id="image-filter">Bilder filtern</InputLabel>
            <Select
              labelId="image-filter"
              label="Bilder filtern"
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
            >
              <MenuItem value="all">Alle Bilder</MenuItem>
              <MenuItem value="approved">Ausgewählte Bilder</MenuItem>
              <MenuItem value="rejected">Abgelehnte Bilder</MenuItem>
              <MenuItem value="undecided">Unentschiedene Bilder</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          {(serverAuswahl.approved.length > 0 || serverAuswahl.rejected.length > 0) && !auswahlImported && (
            <>
              &nbsp;
              <Button variant="contained" onClick={() => loadSharedAuswahl()}>
                Bestehende Auswahl laden
              </Button>
            </>
          )}
          {changesSinceLastSave && (
            <>
              &nbsp;
              <Button variant="contained" onClick={() => saveAuswahl()}>
                Auswahl speichern
              </Button>
            </>
          )}
        </Grid>
      </Grid>
      <Grid item>
        {filteredAndSortedImages.map((image) => (
          <SelectableImage
            key={image.id}
            image={image}
            status={
              localAuswahl.approved.includes(image.name)
                ? 'approved'
                : localAuswahl.rejected.includes(image.name)
                ? 'rejected'
                : 'undecided'
            }
            onClick={() => showImage(image)}
            onNewStatus={(newStatus) => onNewStatus(image, newStatus)}
          />
        ))}
      </Grid>
    </>
  );
};
