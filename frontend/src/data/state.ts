import React, { useEffect, useState } from 'react';
import axios from 'axios';

export interface State {
  year: string | undefined;
  event: string | undefined;
  pictureStatus: {
    [key: string]: PictureStatus;
  };
}

export type PictureStatus = 'approved' | 'rejected' | 'undecided';

export const useAppState = () => {
  const [password, setPassword] = useState<string>(sessionStorage.getItem('password') ?? '');

  useEffect(() => {
    axios.defaults.baseURL = window.location.hostname === 'localhost' ? 'http://localhost:3002' : './';
  }, []);

  useEffect(() => {
    sessionStorage.setItem('password', password);
    axios.defaults.auth = { username: 'admin', password };
  }, [password]);

  const [state, setState] = useState<State>(() =>
    window.location.hash
      ? JSON.parse(atob(window.location.hash.substring(1)))
      : { year: undefined, event: undefined, selectedPictures: [] }
  );

  const updateState = React.useCallback(
    (newState: State) => {
      setState(newState);
      const url = new URL(window.location.href);
      url.hash = btoa(JSON.stringify(newState));
      window.location.replace(url.href);
    },
    [setState]
  );

  return { passwordConfigured: !!password, setPassword, state, updateState };
};
