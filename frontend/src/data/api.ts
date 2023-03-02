export type YearsResponse = string[];

export type EventsResponse = string[];

export interface Image {
  id: string;
  name: string;
  path: string;
  captureDate: string | null;
  thumbnail: string;
  full: string;
}
export type ImagesResponse = Image[];

export type AuswahlResponse = {
  approved: string[];
  rejected: string[];
};
