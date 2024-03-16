import { BadRequestException, Injectable } from "@nestjs/common";
import { ArtistDto } from "./model/artist.dto";
import { Artist } from "./model/artist.entity";
import { ArtistDao } from "./artist.dao";
import { checkId, hasAllFields } from "../utils/validator";

@Injectable()
export class ArtistService {
  
  constructor(
    private readonly dao: ArtistDao
  ) {
  }
  
  findAll(): Artist[] {
    return this.dao.getAll();
  }
  
  findById(id: string): Artist {
    checkId(id);
    this.dao.isArtistExist(id);
    return this.dao.getById(id);
  }
  
  create(createArtistDto: ArtistDto): Artist {
    if (!hasAllFields(createArtistDto, 'artist')) {
      throw new BadRequestException(
        "Body does not contain required fields");
    } else {
      return this.dao.createArtist(createArtistDto);
    }
  }
  
  update(id: string, updateArtistDto: ArtistDto): Artist {
    checkId(id);
    if (!hasAllFields(updateArtistDto, 'artist')) {
      throw new BadRequestException(
        'artistId is invalid');
    }
    this.dao.isArtistExist(id);
    return this.dao.updateArtist(id, updateArtistDto);
  }
  
  remove(id: string): void {
    checkId(id);
    this.dao.isArtistExist(id);
    this.dao.deleteArtist(id);
    this.dao.deleteArtistFromFavorites(id);
  }
}
