import useAxios from 'axios-hooks';
import { Image, ImagesResponse } from '../../data/api';
import React, { useState } from 'react';
import { SelectableImage } from './SelectableImage';
import { PictureStatus } from '../../data/state';
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
import { ShareSelection } from './ShareSelection';

type Filter = 'all' | 'approved' | 'rejected' | 'undecided';

export const SelectImages: React.FC<{
  year: string;
  event: string;
  pictureStatus: { [key: string]: PictureStatus };
  onChange: (selectedImages: { [key: string]: PictureStatus }) => void;
}> = (props) => {
  const [shareSelectionOpen, setShareSelectionOpen] = useState(false);
  const [highlightedImage, setHighlightedImage] = useState<Image>();
  const [filter, setFilter] = useState<Filter>('all');

  const [response] = useAxios<ImagesResponse>({
    url: `images?year=${encodeURIComponent(props.year)}&event=${encodeURIComponent(props.event)}`,
  });

  const filteredAndSortedImages: Image[] = response.data
    ? response.data
        .filter((image) => filter === 'all' || filter === (props.pictureStatus[image.id] ?? 'undecided'))
        .sort((a, b) => (a.captureDate ?? 'z').localeCompare(b.captureDate ?? 'z'))
    : [];

  const showImage = (image: Image) => {
    setHighlightedImage(image);
  };

  const onNewStatus = (image: Image, newStatus: PictureStatus) => {
    if (props.pictureStatus[image.id] === newStatus) {
      props.onChange({ ...props.pictureStatus, [image.id]: 'undecided' });
    } else {
      props.onChange({ ...props.pictureStatus, [image.id]: newStatus });
    }
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
      <ShareSelection
        event={props.event}
        images={response.data ?? []}
        pictureStatus={props.pictureStatus}
        open={shareSelectionOpen}
        onClose={() => setShareSelectionOpen(false)}
      />
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
          <Button variant="contained" onClick={() => setShareSelectionOpen(true)}>
            Aktuelle Auswahl teilen
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        {filteredAndSortedImages.map((image) => (
          <SelectableImage
            key={image.id}
            image={image}
            status={props.pictureStatus[image.id] ?? 'undecided'}
            onClick={() => showImage(image)}
            onNewStatus={(newStatus) => onNewStatus(image, newStatus)}
          />
        ))}
      </Grid>
    </>
  );
};
