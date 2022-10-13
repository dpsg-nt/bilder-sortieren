import React, { PropsWithChildren } from 'react';
import { SelectYear } from './Content/SelectYear';
import { SelectEvent } from './Content/SelectEvent';
import { SelectImages } from './Content/SelectImages';
import { Login } from './Content/Login';
import { useAppState } from '../data/state';
import { PageSection } from './Page/PageSection';

export const RoutingAndState: React.FC = () => {
  const { passwordConfigured, state, updateState, setPassword } = useAppState();

  if (!passwordConfigured) {
    return (
      <SmallPageSection>
        <Login setPassword={setPassword} />
      </SmallPageSection>
    );
  }
  if (state.year === undefined) {
    return (
      <SmallPageSection>
        <SelectYear onSelect={(year) => updateState({ year, event: undefined, pictureStatus: {} })} />
      </SmallPageSection>
    );
  }
  if (state.event === undefined) {
    return (
      <SmallPageSection>
        <SelectEvent year={state.year} onSelect={(event) => updateState({ ...state, event })} />
      </SmallPageSection>
    );
  }
  return (
    <WidePageSection>
      <SelectImages
        year={state.year}
        event={state.event}
        pictureStatus={state.pictureStatus}
        onChange={(pictures) => updateState({ ...state, pictureStatus: pictures })}
      />
    </WidePageSection>
  );
};

const SmallPageSection: React.FC<PropsWithChildren> = (props) => (
  <PageSection maxWidth="600px">{props.children}</PageSection>
);

const WidePageSection: React.FC<PropsWithChildren> = (props) => (
  <PageSection maxWidth="1100px">{props.children}</PageSection>
);
