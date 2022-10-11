import useAxios from 'axios-hooks';
import { Image, ImagesResponse } from '../data/api';
import React, { useState } from 'react';
import { SelectableImage } from './SelectableImage';
import { PictureStatus } from '../data/state';
import { Dialog, DialogContent } from '@mui/material';

export const SelectImages: React.FC<{
  year: string;
  event: string;
  pictureStatus: { [key: string]: PictureStatus };
  onChange: (selectedImages: { [key: string]: PictureStatus }) => void;
}> = (props) => {
  const [highlightedImage, setHighlightedImage] = useState<Image>();

  const [response] = useAxios<ImagesResponse>({
    url: `http://localhost:3002/images?year=${encodeURIComponent(props.year)}&event=${encodeURIComponent(props.event)}`,
  });

  const showImage = (image: Image) => {
    setHighlightedImage(image);
  };

  return response.loading || !response.data ? (
    <div>loading...</div>
  ) : (
    <>
      <Dialog open={highlightedImage !== undefined} onClose={() => setHighlightedImage(undefined)} maxWidth="lg">
        <DialogContent>
          <img
            src={highlightedImage?.full}
            alt={highlightedImage?.name}
            style={{ maxHeight: '80vh', maxWidth: '100%' }}
          />
        </DialogContent>
      </Dialog>
      <div>
        {response.data
          .sort((a, b) => (a.captureDate ?? 'z').localeCompare(b.captureDate ?? 'z'))
          .map((image) => (
            <SelectableImage
              key={image.id}
              image={image}
              status={props.pictureStatus[image.name]}
              onClick={() => showImage(image)}
              onNewStatus={(newStatus) => props.onChange({ ...props.pictureStatus, [image.name]: newStatus })}
            />
          ))}
      </div>
    </>
  );
};
