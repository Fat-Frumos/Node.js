import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { Album } from "./model/album.entity";
import { v4 as uuidv4 } from "uuid";
import { AlbumDto } from "./model/album.dto";
import { FavoriteDao } from "../favorite/favorite.dao";


@Injectable()
export class AlbumDao{
  
  private albums: Album[] = [];
  
  constructor(
    @Inject(forwardRef(() => FavoriteDao))
    private readonly favoriteDao: FavoriteDao
  ) {
  }
  
  getAll(): Album[] {
    return this.albums;
  }
  
  getById(albumId: string): Album {
    const album = this.albums.find((album) => album.id === albumId);
    if (!album) {
      throw new NotFoundException('Album not found');
    } else {
      return album;
    }
  }
  
  createAlbum(createAlbumDto: AlbumDto): Album {
    const album: Album = { id: uuidv4(), ...createAlbumDto, };
    this.albums.push(album);
    return album;
  }
  
  isAlbumExist = (albumId: string): void => {
    if (!this.albums.find((album) => album.id === albumId)) {
      throw new NotFoundException("album doesn't exist");
    }
  };
  
  updateAlbum(id: string, updateAlbumDto: AlbumDto): Album {
    const index = this.albums.findIndex((album) => album.id === id);
    this.albums[index] = { ...this.albums[index], ...updateAlbumDto};
    return this.albums[index];
  }
  
  deleteArtistFromAlbum = (artistId: string) => {
    const album = this.albums.find((album) => album.artistId === artistId);
    if (album) {
      album.artistId = null;
    }
  };
  
  deleteAlbum = (albumId: string): void => {
    this.albums = this.albums.filter((album): boolean => albumId !== album.id);
    this.favoriteDao.removeAlbumFromTrack(albumId);
  };
  
  deleteAlbumFromFavorites(id: string): void {
    this.favoriteDao.removeAlbum(id);
  }
}
