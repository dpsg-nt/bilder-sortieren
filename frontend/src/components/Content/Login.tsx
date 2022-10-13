import React, { useState } from 'react';
import axios from 'axios';
import { Button, Grid, TextField, Typography } from '@mui/material';

export const Login: React.FC<{ setPassword: (password: string) => void }> = (props) => {
  const [password, setPassword] = useState<string>('');
  const [invalidPassword, setInvalidPassword] = useState(false);

  const checkAndSetPassword = async () => {
    const result = await axios.get('http://localhost:3002/years', {
      auth: { username: 'admin', password: password },
      validateStatus: (status) => true,
    });
    if (result.status !== 200) {
      setInvalidPassword(true);
    } else {
      props.setPassword(password);
    }
  };

  return (
    <>
      <Grid item>
        <Typography variant="h5">Login</Typography>
      </Grid>
      <Grid item>
        <TextField
          label="Passwort"
          fullWidth
          onChange={(e) => {
            setPassword(e.target.value);
            setInvalidPassword(false);
          }}
          helperText={invalidPassword && 'Ungültiges Passwort!'}
          error={invalidPassword}
        />
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={checkAndSetPassword}>
          Login
        </Button>
      </Grid>
    </>
  );
};
