import { Artist } from "../../artist/model/artist.entity";
import { Album } from "../../album/model/album.entity";
import { Track } from "../../track/model/track.entity";

export interface Favorites {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
