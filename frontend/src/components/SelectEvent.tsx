import useAxios from 'axios-hooks';
import { EventsResponse } from '../data/api';
import React from 'react';

export const SelectEvent: React.FC<{ year: string; onSelect: (event: string) => void }> = (props) => {
  const [response] = useAxios<EventsResponse>({
    url: `http://localhost:3002/events?year=${encodeURIComponent(props.year)}`,
  });

  return response.loading ? (
    <div>loading...</div>
  ) : (
    <ul>
      {response.data &&
        response.data.map((event) => (
          <li key={event}>
            <span onClick={() => props.onSelect(event)}>{event}</span>
          </li>
        ))}
    </ul>
  );
};
