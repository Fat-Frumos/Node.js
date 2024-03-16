import { Track } from "./track.entity";

export type TrackDto = Omit<Track, 'id'>;
