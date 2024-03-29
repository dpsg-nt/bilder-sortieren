import React, { useEffect, useState } from 'react';
import axios from 'axios';

export interface State {
  year: string | undefined;
  event: string | undefined;
}

export const useAppState = () => {
  const [password, setPassword] = useState<string>(sessionStorage.getItem('password') ?? '');
  const [axiosConfigured, setAxiosConfigured] = useState(false);

  useEffect(() => {
    axios.defaults.baseURL = window.location.hostname === 'localhost' ? 'http://localhost:3002' : './';
  }, []);

  useEffect(() => {
    if (password) {
      sessionStorage.setItem('password', password);
      axios.defaults.headers.common = { 'X-PW-Auth': password };
      setAxiosConfigured(true);
    }
  }, [password]);

  const [state, setState] = useState<State>(() =>
    window.location.hash ? JSON.parse(atob(window.location.hash.substring(1))) : { year: undefined, event: undefined }
  );

  const updateState = React.useCallback(
    (newState: State) => {
      setState(newState);
      const url = new URL(window.location.href);
      url.hash = btoa(JSON.stringify(newState));
      window.location.assign(url.href);
    },
    [setState]
  );

  return { passwordConfigured: !!password && axiosConfigured, setPassword, state, updateState };
};
