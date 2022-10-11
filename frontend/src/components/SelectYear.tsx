import useAxios from 'axios-hooks';
import { YearsResponse } from '../data/api';
import React from 'react';

export const SelectYear: React.FC<{ onSelect: (year: string) => void }> = (props) => {
  const [response] = useAxios<YearsResponse>({
    url: 'http://localhost:3002/years',
  });

  return response.loading ? (
    <div>loading...</div>
  ) : (
    <ul>
      {response.data &&
        response.data.map((year) => (
          <li key={year}>
            <span onClick={() => props.onSelect(year)}>{year}</span>
          </li>
        ))}
    </ul>
  );
};
