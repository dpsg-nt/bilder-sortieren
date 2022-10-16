import React, { useState } from 'react';
import { Image } from '../../data/api';
import { PictureStatus } from '../../data/state';
import { makeStyles } from 'tss-react/mui';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const useStyles = makeStyles()((theme) => ({
  image: {
    display: 'inline-block',
    height: '250px',
    width: '250px',
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    margin: theme.spacing(0.5),
    cursor: 'pointer',
    position: 'relative',
  },
  imageApproved: {
    borderWidth: '5px',
    borderStyle: 'solid',
    borderColor: theme.palette.success.main,
  },
  imageRejected: {
    borderWidth: '5px',
    borderStyle: 'solid',
    borderColor: theme.palette.error.main,
  },
  imageNotReviewed: {
    borderWidth: '5px',
    borderStyle: 'solid',
    borderColor: '#ccc',
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
    backgroundColor: 'rgba(255,255,255,0.7)',
    fontWeight: 'bold',
  },
  optionRow: { display: 'flex', flexGrow: 1, justifyContent: 'stretch' },
  optionItem: { display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
}));

export const SelectableImage: React.FC<{
  image: Image;
  status: PictureStatus;
  onClick: () => void;
  onNewStatus: (status: PictureStatus) => void;
}> = (props) => {
  const { classes, theme } = useStyles();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      className={`${classes.image} ${
        props.status === 'undecided'
          ? classes.imageNotReviewed
          : props.status === 'approved'
          ? classes.imageApproved
          : classes.imageRejected
      }`}
      style={{ backgroundImage: `url(${props.image.thumbnail})` }}
    >
      <div className={classes.optionField} style={{ opacity: hovered ? 1.0 : 0.0 }}>
        <div className={classes.optionRow}>
          <div className={classes.optionItem} onClick={props.onClick}>
            <ZoomInIcon color="primary" fontSize="large" />
          </div>
        </div>
        <div className={classes.optionRow}>
          <div className={classes.optionItem} onClick={() => props.onNewStatus('approved')}>
            <CheckCircleOutlineIcon
              sx={{ color: props.status === 'approved' ? theme.palette.success.main : theme.palette.primary.main }}
            />
          </div>
          <div className={classes.optionItem} onClick={() => props.onNewStatus('rejected')}>
            <NotInterestedIcon
              sx={{ color: props.status === 'rejected' ? theme.palette.error.main : theme.palette.primary.main }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
