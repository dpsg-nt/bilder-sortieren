import React, { useEffect, useState } from 'react';
import { State } from '../data/state';
import { SelectYear } from './SelectYear';
import { SelectEvent } from './SelectEvent';
import { SelectImages } from './SelectImages';
import { Login } from './Login';
import axios from 'axios';

export const App: React.FC = () => {
  const [password, setPassword] = useState<string>(sessionStorage.getItem('password') ?? '');

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

  if (!password) {
    return <Login setPassword={setPassword} />;
  }
  if (state.year === undefined) {
    return <SelectYear onSelect={(year) => updateState({ year, event: undefined, pictureStatus: {} })} />;
  }
  if (state.event === undefined) {
    return <SelectEvent year={state.year} onSelect={(event) => updateState({ ...state, event })} />;
  }
  return (
    <SelectImages
      year={state.year}
      event={state.event}
      pictureStatus={state.pictureStatus}
      onChange={(pictures) => updateState({ ...state, pictureStatus: pictures })}
    />
  );
};
