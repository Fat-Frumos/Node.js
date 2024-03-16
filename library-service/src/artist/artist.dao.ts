import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { Artist } from "./model/artist.entity";
import { ArtistDto } from "./model/artist.dto";
import { v4 as uuidv4 } from "uuid";
import { FavoriteDao } from "../favorite/favorite.dao";

@Injectable()
export class ArtistDao {
  
  constructor(
    @Inject(forwardRef(() => FavoriteDao))
    private readonly favoriteDao: FavoriteDao
  ) {
  }
  
  private artists: Artist[] = [];
  
  getById(artistId: string): Artist {
    return this.artists.find((artist) => artist.id === artistId);
  }
  
  getAll(): Artist[] {
    return this.artists;
  }
  
  isArtistExist(artistId: string) {
    if (!this.artists.find((album) => album.id === artistId)) {
      throw new NotFoundException("artist doesn't exist");
    }
  }
  
  createArtist(createArtistDto: ArtistDto): Artist {
    const artists: Artist = { id: uuidv4(), ...createArtistDto };
    this.artists.push(artists);
    return artists;
  }
  
  updateArtist(id: string, updateArtistDto: ArtistDto) {
    const index = this.artists.findIndex((artist) => artist.id === id);
    this.artists[index] = { ...this.artists[index], ...updateArtistDto};
    return this.artists[index];
  }
  
  deleteArtist(id: string) {
    this.artists = this.artists.filter((artist): boolean => id !== artist.id);
    this.favoriteDao.removeArtistFromAlbum(id);
    this.favoriteDao.removeArtistFromTrack(id);
  }
  
  deleteArtistFromFavorites(id: string) {
    this.favoriteDao.removeArtist(id);
  }
}
