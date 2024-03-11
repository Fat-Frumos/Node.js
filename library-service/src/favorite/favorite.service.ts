import {
  BadRequestException, forwardRef, Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { Favorite } from "./model/favorite.entity";
import { Artist } from "../artist/model/artist.entity";
import { Track } from "../track/model/track.entity";
import { Album } from "../album/model/album.entity";
import { FavoriteMessage } from "./model/favorite.message.dto";
import { ArtistService } from "../artist/artist.service";
import { AlbumService } from "../album/album.service";
import { TrackService } from "../track/track.service";


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
  
  getAllFavorites(): Favorite {
    return {
      artists: this.favoriteArtists,
      albums: this.favoriteAlbums,
      tracks: this.favoriteTracks,
    };
  }
  
  addToFavoriteTracks(trackId: string): FavoriteMessage {
    return this.addToFavorites(
      trackId,
      this.trackService.findById,
      this.favoriteTracks,
      'Track'
    );
  }
  
  removeFromFavoriteTracks(trackId: string): FavoriteMessage {
    return this.removeFromFavorites(
      trackId,
      this.favoriteTracks,
      'Track'
    );
  }
  
  addToFavoriteAlbums(albumId: string): FavoriteMessage {
    return this.addToFavorites(
      albumId,
      this.albumService.findById,
      this.favoriteAlbums,
      'Album'
    );
  }
  
  removeFromFavoriteAlbums(albumId: string): FavoriteMessage {
    return this.removeFromFavorites(
      albumId,
      this.favoriteAlbums,
      'Album'
    );
  }
  
  addToFavoriteArtists(artistId: string): FavoriteMessage {
    return this.addToFavorites(
      artistId,
      this.artistService.findById,
      this.favoriteArtists,
      'Artist'
    );
  }
  
  removeFromFavoriteArtists(artistId: string): FavoriteMessage {
    return this.removeFromFavorites(
      artistId,
      this.favoriteArtists,
      'Artist'
    );
  }
  
  private addToFavorites<T extends { id: string }>(
    entityId: string,
    findByIdFn: (id: string) => T | undefined,
    favorites: T[],
    entityName: string
  ): FavoriteMessage {
    const entity = findByIdFn(entityId);
    if (!entity) {
      throw new NotFoundException(`${entityName} not found`);
    }
    if (favorites.some(favEntity => favEntity.id === entityId)) {
      throw new BadRequestException(`${entityName} already exists in favorites`);
    }
    favorites.push(entity);
    return { message: `${entityName} added to favorites` };
  }
  
  private removeFromFavorites<T extends { id: string }>(
    entityId: string,
    favoritesArray: T[],
    entityName: string
  ): FavoriteMessage {
    const index = favoritesArray.findIndex(entity => entity.id === entityId);
    if (index === -1) {
      throw new NotFoundException(`${entityName} not found in favorites`);
    }
    favoritesArray.splice(index, 1);
    return { message: `${entityName} removed from favorites` };
  }
}
