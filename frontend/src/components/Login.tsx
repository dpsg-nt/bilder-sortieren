import React, { useState } from 'react';
import axios from 'axios';

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
    <div>
      Password: <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={checkAndSetPassword}>Login</button>
      {invalidPassword && <div>invalid password!</div>}
    </div>
  );
};
