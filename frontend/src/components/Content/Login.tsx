import React, { useState } from 'react';
import axios from 'axios';
import { Button, Grid, TextField, Typography } from '@mui/material';

export const Login: React.FC<{ setPassword: (password: string) => void }> = (props) => {
  const [password, setPassword] = useState<string>('');
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [loginPending, setLoginPending] = useState(false);

  const checkAndSetPassword = async () => {
    setLoginPending(true);
    const result = await axios.get('years', {
      headers: { 'X-PW-Auth': password },
      validateStatus: (status) => true,
    });
    if (result.status !== 200) {
      setInvalidPassword(true);
    } else {
      props.setPassword(password);
    }
    setLoginPending(false);
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
          autoFocus
          onChange={(e) => {
            setPassword(e.target.value);
            setInvalidPassword(false);
          }}
          type="password"
          onKeyDown={(e) => e.code === 'Enter' && checkAndSetPassword()}
          helperText={invalidPassword && 'Ungültiges Passwort!'}
          error={invalidPassword}
        />
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={checkAndSetPassword} disabled={loginPending}>
          Login
        </Button>
      </Grid>
    </>
  );
};
