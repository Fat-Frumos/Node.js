import {
  forwardRef,
  HttpException,
  HttpStatus, Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { Track } from "./model/track.entity";
import { TrackDto } from "./model/track.dto";
import { FavoriteDao } from "../favorite/favorite.dao";

@Injectable()
export class TrackDao {
  
  private tracks: Track[] = [];
  
  constructor(
    @Inject(forwardRef(() => FavoriteDao))
    private readonly favoriteDao: FavoriteDao
    ){
  }
  
  getById(trackId: string): Track {
    const track = this.tracks.find((track) => track.id === trackId);
    if (!track) {
      throw new NotFoundException("Track not found");
    } else {
      return track;
    }
  }
  
  isExist(id: string) {
    if (this.getById(id) == null) {
      throw new HttpException(
        "Track doesn't exist",
        HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
  
  removeAlbumFromTrack(albumId: string) {
    const track = this.tracks.find((track) => track.albumId === albumId);
    if (track) {
      track.albumId = null;
    }
  };
  
  deleteArtistFromTrack(artistId: string) {
    const track = this.tracks.find((track) => track.artistId === artistId);
    if (track) {
      track.artistId = null;
    }
  }
  
  getAllTracks(): Track[] {
    return this.tracks;
  }
  
  isTrackExist(id: string) {
    if (!this.tracks.find((track) => track.id === id)) {
      throw new NotFoundException("tracks doesn't exist");
    }
  }
  
  create(dto: TrackDto) {
    const track = { id: uuidv4(), ...dto, };
    this.tracks.push(track);
    return track;
  }
  
  updateTrack(id: string, dto: TrackDto) {
    const index = this.tracks.findIndex((track) => track.id === id);
    this.tracks[index] = { ...this.tracks[index], ...dto};
    return this.tracks[index];
  }
  
  deleteTrack(id: string) {
    this.tracks = this.tracks.filter((track) => id !== track.id);
  }
  
  deleteTrackFromFavorites(id: string) {
    this.favoriteDao.removeTrack(id);
  }
}
