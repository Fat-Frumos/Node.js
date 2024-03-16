import {
  BadRequestException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { Album } from "./model/album.entity";
import { CreateAlbumDto } from "./model/album.create.dto";
import { UpdateAlbumDto } from "./model/album.update.dto";
import { TrackService } from "../track/track.service";
import { FavoriteService } from "../favorite/favorite.service";

@Injectable()
export class AlbumService {
  private readonly albums: Album[] = [];
  
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoriteService))
    private readonly favoriteService: FavoriteService
  ) {}
  
  findAll(): Album[] {
    return this.albums;
  }
  
  findById(id: string): Album {
    const album: Album = this.albums.find(album => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }
  
  create(createAlbumDto: CreateAlbumDto): Album {
    if (!createAlbumDto.name || !createAlbumDto.year || !createAlbumDto.artistId) {
      throw new BadRequestException('Name, year, and artistId are required');
    }
    const album: Album = { id: uuidv4(), ...createAlbumDto, };
    this.albums.push(album);
    return album;
  }
  
  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const album: Album = this.findById(id);
    Object.assign(album, updateAlbumDto);
    return album;
  }
  
  remove(id: string): HttpStatus {
    const index = this.albums.findIndex(album => album.id === id);
    if (index === -1) {
      throw new NotFoundException('Album not found');
    }
    this.favoriteService.removeFromFavoriteAlbums(id);
    this.trackService.update(id, null);
    this.albums.splice(index, 1);
    return HttpStatus.NO_CONTENT;
  }
}
