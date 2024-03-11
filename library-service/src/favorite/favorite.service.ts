import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable, NotFoundException
} from "@nestjs/common";
import { Artist } from "../artist/model/artist.entity";
import { Track } from "../track/model/track.entity";
import { Album } from "../album/model/album.entity";
import { ArtistService } from "../artist/artist.service";
import { AlbumService } from "../album/album.service";
import { TrackService } from "../track/track.service";
import { isUUID } from "class-validator";

@Injectable()
export class FavoriteService {
  private readonly favoriteArtists: Artist[] = [];
  private readonly favoriteAlbums: Album[] = [];
  private readonly favoriteTracks: Track[] = [];
  
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService
  ) {}
  
  findAll(): { artists: Artist[], albums: Album[], tracks: Track[] } {
    return {
      artists: [...this.favoriteArtists],
      albums: [...this.favoriteAlbums],
      tracks: [...this.favoriteTracks],
    };
  }
  
  addToFavoriteArtists(id: string, artist: Artist) {
    const existingArtist = this.artistService.findById(id);
    if (existingArtist && !this.checkEntityExistence(id, this.favoriteArtists)) {
      this.favoriteArtists.push(artist);
      return this.favoriteArtists.find(a => a.id === id);
    }
    if (!artist) {
      throw new NotFoundException('Artist does not exist');
    }
    throw new BadRequestException('Artist is already in favorites');
  }
  
  addToFavoriteAlbums(id: string, album: Album) {
    this.validateId(id);
    const existingAlbum = this.albumService.findById(id);
    if (!existingAlbum) {
      throw new NotFoundException('Album does not exist');
    }
    if (this.checkEntityExistence(id, this.favoriteAlbums)) {
      throw new BadRequestException('Album is already in favorites');
    }
    this.favoriteAlbums.push(album);
    return this.favoriteAlbums.find(a => a.id === id);
  }
  
  
  addToFavoriteTracks(id: string, track: Track) {
    this.validateId(id);
    const existingTrack = this.trackService.findById(id);
    if (existingTrack && !this.checkEntityExistence(id, this.favoriteTracks)) {
      this.favoriteTracks.push(track);
      return this.favoriteTracks.find(t => t.id === id);
    }
    throw new BadRequestException('Track does not exist or is already in favorites');
  }
  
  removeFromFavoriteArtists(id: string) {
    this.validateId(id);
    const artistIndex = this.favoriteArtists.findIndex(a => a.id === id);
    if (artistIndex !== -1) {
      this.favoriteArtists.splice(artistIndex, 1);
    } else {
      throw new NotFoundException('Artist not found in favorites');
    }
  }
  
  removeFromFavoriteAlbums(id: string) {
    this.validateId(id);
    const albumIndex = this.favoriteAlbums.findIndex(a => a.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException('Album not found in favorites');
    }
    this.favoriteAlbums.splice(albumIndex, 1);
  }
  
  removeFromFavoriteTracks(id: string) {
    this.validateId(id);
    const trackIndex = this.favoriteTracks.findIndex(t => t.id === id);
    if (trackIndex !== -1) {
      this.favoriteTracks.splice(trackIndex, 1);
    } else {
      throw new NotFoundException('Track not found in favorites');
    }
  }
  
  private checkEntityExistence(id: string, favorites: any[]): boolean {
    return favorites.some(favorite => favorite.id === id);
  }
  
  validateId(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid ID format');
    }
  }
}
