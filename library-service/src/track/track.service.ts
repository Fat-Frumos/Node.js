import {
  BadRequestException, forwardRef,
  HttpStatus, Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { CreateTrackDto } from "./model/track.create.dto";
import { UpdateTrackDto } from "./model/track.update.dto";
import { Track } from "./model/track.entity";
import { FavoriteService } from "../favorite/favorite.service";
import { AlbumService } from "../album/album.service";

@Injectable()
export class TrackService {
  private readonly tracks: Track[] = [];
  
  constructor(
    @Inject(forwardRef(() => FavoriteService))
    private readonly favoriteService: FavoriteService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService
  ) {}
  
  findAll(): Track[] {
    return this.tracks;
  }
  
  findById(id: string): Track {
    const track: Track = this.tracks.find(track => track.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }
  
  create(createTrackDto: CreateTrackDto): Track {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new BadRequestException('Name and duration are required');
    }
    const track: Track = { id: uuidv4(), ...createTrackDto };
    this.tracks.push(track);
    return track;
  }
  
  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const index = this.tracks.findIndex(track => track.id === id);
    if (index === -1) {
      throw new NotFoundException('Track not found');
    }
    this.tracks[index] = { ...this.tracks[index], ...updateTrackDto };
    return this.tracks[index];
  }
  
  remove(id: string): HttpStatus {
    const track = this.findById(id);
    const index = this.tracks.indexOf(track);
    if (index === -1) {
      throw new NotFoundException('Track not found');
    }
    this.favoriteService.removeFromFavoriteTracks(id);
    this.updateAlbumTrack(id, null);
    this.tracks.splice(index, 1);
    return HttpStatus.NO_CONTENT;
  }
  
  updateAlbumTrack(trackId: string, updatedTrackId: string | null): void {
    this.albumService.findAll().forEach(album => {
      const index = album.id.indexOf(trackId);
      if (index !== -1) {
        album.id = updatedTrackId;
      }
    });
  }
}
