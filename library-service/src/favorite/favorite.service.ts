import { Injectable } from "@nestjs/common";

import { checkId } from "../utils/validator";
import { Favorites } from "./model/favorite.entity";
import { FavoriteDao } from "./favorite.dao";

@Injectable()
export class FavoriteService {
  
  constructor(private readonly dao: FavoriteDao) {}
  
  findAll(): Favorites {
    return this.dao.getAll();
  }
  
  addToFavoriteArtists(id: string) {
    checkId(id);
    this.dao.addArtist(id);
  }
  
  removeFromFavoriteArtists(id: string) {
    checkId(id);
    this.dao.removeArtist(id);
  }
  
  addToFavoriteAlbums(id: string) {
    checkId(id);
    this.dao.addAlbum(id);
  }
  
  removeFromFavoriteAlbums(id: string) {
    checkId(id);
    this.dao.removeAlbum(id);
  }
  
  addToFavoriteTracks(id: string) {
    checkId(id);
    this.dao.addTrack(id);
  }
  
  removeFromFavoriteTracks(id: string) {
    checkId(id);
    this.dao.removeTrack(id);
  }
}
