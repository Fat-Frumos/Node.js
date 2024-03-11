import {
  BadRequestException, forwardRef,
  HttpStatus, Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { CreateArtistDto } from "./model/artist.create.dto";
import { UpdateArtistDto } from "./model/artist.update.dto";
import { Artist } from "./model/artist.entity";
import { AlbumService } from "../album/album.service";
import { FavoriteService } from "../favorite/favorite.service";
import { TrackService } from "../track/track.service";

@Injectable()
export class ArtistService {
  
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoriteService))
    private readonly favoriteService: FavoriteService
  ) {}
  
  private readonly artists: Artist[] = [];
  
  findAll(): Artist[] {
    return this.artists;
  }
  
  findById(id: string): Artist {
    const artist: Artist = this.artists.find(artist => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }
  
  create(createArtistDto: CreateArtistDto): Artist {
    if (!createArtistDto.name) {
      throw new BadRequestException('Name is required');
    }
    const artist: Artist = { id: uuidv4(), ...createArtistDto };
    this.artists.push(artist);
    return artist;
  }
  
  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artist: Artist = this.findById(id);
    Object.assign(artist, updateArtistDto);
    return artist;
  }
  
  remove(id: string): HttpStatus {
    const index = this.artists.findIndex(artist => artist.id === id);
    this.updateAlbumTrack(id, null);
    this.trackService.updateTracks(id, null);
    this.albumService.updateArtists(id, null);
    this.favoriteService.removeFromFavoriteArtists(id);
    this.artists.splice(index, 1);
    
    if (index === -1) {
      throw new NotFoundException('Artist not found');
    }
    this.artists.splice(index, 1);
    return HttpStatus.NO_CONTENT;
  }
  
  updateAlbumTrack(artistId: string, updatedArtistId: string | null): void {
    this.albumService.findAll().forEach(album => {
      if (album.artistId === artistId) {
        album.artistId = updatedArtistId;
      }
    });
  }
}
