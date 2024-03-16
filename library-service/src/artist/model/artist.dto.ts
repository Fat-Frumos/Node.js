import { Artist } from "./artist.entity";

export type ArtistDto = Omit<Artist, 'id'>;
