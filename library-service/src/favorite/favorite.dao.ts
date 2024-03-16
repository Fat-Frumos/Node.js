import { Favorites } from "./model/favorite.entity";
import {
  BadRequestException, forwardRef, Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { ArtistDao } from "../artist/artist.dao";
import { AlbumDao } from "../album/album.dao";
import { TrackDao } from "../track/track.dao";

@Injectable()
export class FavoriteDao {
  
  constructor(
    @Inject(forwardRef(() => ArtistDao))
    private readonly artistDao: ArtistDao,
    @Inject(forwardRef(() => AlbumDao))
    private readonly albumDao: AlbumDao,
    @Inject(forwardRef(() => TrackDao))
    private readonly trackDao: TrackDao,
  ) {
  }
  
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: []
  };
  
  getAll(): Favorites {
    return this.favorites;
  }
  
  addArtist(artistId: string): void {
    const artist = this.artistDao.getById(artistId);
    this.isExistingArtistInFavorite(artistId);
    this.favorites.artists.push(artist);
  }
  
  removeArtist(artistId: string): void {
    const index = this.findIndexByArtistId(artistId);
    this.favorites.artists.splice(index, 1);
  }
  
  addAlbum(albumId: string): void {
    const album = this.albumDao.getById(albumId);
    this.isExistingAlbumInFavorite(albumId);
    this.favorites.albums.push(album);
  }
  
  removeAlbum(albumId: string): void {
    const index = this.findIndexByAlbumId(albumId);
    this.favorites.albums.splice(index, 1);
  }
  
  addTrack(trackId: string): void {
    const track = this.trackDao.getById(trackId);
    this.isExistingTrackInFavorite(trackId);
    this.favorites.tracks.push(track);
  }
  
  removeTrack(trackId: string): void {
    const index = this.findIndexByTrackId(trackId);
    this.favorites.tracks.splice(index, 1);
    // this.favorites.tracks = this.favorites.tracks.filter((track) => track.id !== id);
  }
  
  private isExistingArtistInFavorite(id: string) {
    if (this.favorites.artists.some((a) => a.id === id)) {
      throw new BadRequestException("Artist is already in favorites");
    }
  }
  
  private isExistingAlbumInFavorite(albumId: string) {
    if (this.favorites.albums.some((a) => a.id === albumId)) {
      throw new BadRequestException("Album is already in favorites");
    }
  }
  
  private isExistingTrackInFavorite(trackId: string) {
    if (this.favorites.tracks.some(track => track.id === trackId)) {
      throw new BadRequestException("Track not found in favorites");
    }
  }
  
  private findIndexByArtistId(artistId: string) {
    const index = this.favorites.artists.findIndex((a) => a.id === artistId);
    if (index === -1) {
      throw new NotFoundException("Artist not found in favorites");
    }
    return index;
  }
  
  private findIndexByAlbumId(albumId: string) {
    const index = this.favorites.albums.findIndex((a) => a.id === albumId);
    if (index === -1) {
      throw new NotFoundException("Album not found in favorites");
    }
    return index;
  }
  
  private findIndexByTrackId(trackId: string) {
    const index = this.favorites.tracks.findIndex((t) => t.id === trackId);
    if (index === -1) {
      throw new NotFoundException("Track not found in favorites");
    }
    return index;
  }
  
  removeAlbumFromTrack(albumId: string) {
    return this.trackDao.removeAlbumFromTrack(albumId);
  }
  
  removeArtistFromAlbum(id: string) {
    return this.albumDao.deleteArtistFromAlbum(id);
  }
  
  removeArtistFromTrack(id: string) {
    return this.trackDao.deleteArtistFromTrack(id);
  }
}
