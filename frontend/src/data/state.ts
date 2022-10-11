export interface State {
  year: string | undefined;
  event: string | undefined;
  pictureStatus: {
    [key: string]: PictureStatus;
  };
}

export type PictureStatus = 'approved' | 'rejected';

export interface StateAccessor {
  state: State;
  updateState: (state: State) => void;
}
