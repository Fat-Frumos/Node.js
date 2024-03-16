import { BadRequestException, Injectable } from "@nestjs/common";
import { Album } from "./model/album.entity";
import { AlbumDao } from "./album.dao";
import { checkId, hasAllFields } from "../utils/validator";
import { AlbumDto } from "./model/album.dto";

@Injectable()
export class AlbumService {
  
  constructor(
    private readonly dao: AlbumDao
  ) {}

  findAll(): Album[] {
    return this.dao.getAll();
  }
  
  findById(id: string): Album {
    checkId(id);
    this.dao.isAlbumExist(id);
    return this.dao.getById(id);
  }
  
  create(createAlbumDto: AlbumDto): void {
    if (!hasAllFields(createAlbumDto, "album")) {
      throw new BadRequestException(
        "Body does not contain required fields");
    } else {
      this.dao.createAlbum(createAlbumDto);
    }
  }
  
  update(id: string, updateAlbumDto: AlbumDto): Album {
    checkId(id);
    checkId(updateAlbumDto.artistId);
    this.dao.isAlbumExist(id);
    if (!hasAllFields(updateAlbumDto, "album")) {
      throw new BadRequestException(
        "Body does not contain required fields");
    } else {
      return this.dao.updateAlbum(id, updateAlbumDto);
    }
  };
  
  remove(id: string): void {
    checkId(id);
    this.dao.isAlbumExist(id);
    this.dao.deleteAlbum(id);
    this.dao.deleteAlbumFromFavorites(id);
  }
}
