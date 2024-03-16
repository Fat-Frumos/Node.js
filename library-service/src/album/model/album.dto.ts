import { Album } from "./album.entity";

export type AlbumDto = Omit<Album, 'id'>;
