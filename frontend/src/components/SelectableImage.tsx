import { useTheme } from '@mui/material';
import React, { CSSProperties, useState } from 'react';
import { Image } from '../data/api';
import { PictureStatus } from '../data/state';

const useImageStyles = () => {
  const theme = useTheme();
  return {
    image: {
      display: 'inline-block',
      height: '240px',
      width: '240px',
      backgroundPosition: '50% 50%',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      margin: theme.spacing(0.5),
      cursor: 'pointer',
      position: 'relative',
    } as CSSProperties,
    imageApproved: {
      borderWidth: '3px',
      borderStyle: 'solid',
      borderColor: theme.palette.success.main,
    },
    imageRejected: {
      borderWidth: '3px',
      borderStyle: 'solid',
      borderColor: theme.palette.error.main,
    },
    imageNotReviewed: {
      borderWidth: '3px',
      borderStyle: 'solid',
      borderColor: theme.palette.text.disabled,
    },
    optionField: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: 'flex',
      flexFlow: 'column',
      justifyContent: 'stretch',
      backgroundColor: '#fff',
      fontWeight: 'bold',
    } as CSSProperties,
    optionRow: { display: 'flex', flexGrow: 1, justifyContent: 'stretch' },
    optionItem: { display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  };
};

export const SelectableImage: React.FC<{
  image: Image;
  status?: PictureStatus;
  onClick: () => void;
  onNewStatus: (status: PictureStatus) => void;
}> = (props) => {
  const styles = useImageStyles();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        ...styles.image,
        backgroundImage: `url(${props.image.thumbnail})`,
        ...(props.status === undefined
          ? styles.imageNotReviewed
          : props.status === 'approved'
          ? styles.imageApproved
          : styles.imageRejected),
      }}
    >
      <div
        style={{
          ...styles.optionField,
          opacity: hovered ? 0.7 : 0.0,
        }}
      >
        <div style={styles.optionRow}>
          <div style={styles.optionItem} onClick={props.onClick}>
            <div>Lupe</div>
          </div>
        </div>
        <div style={styles.optionRow}>
          <div style={styles.optionItem} onClick={() => props.onNewStatus('approved')}>
            <div>Approve</div>
          </div>
          <div style={styles.optionItem} onClick={() => props.onNewStatus('rejected')}>
            <div>Reject</div>
          </div>
        </div>
      </div>
    </div>
  );
};
