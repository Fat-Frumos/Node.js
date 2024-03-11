import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post, UsePipes, ValidationPipe
} from "@nestjs/common";
import { Album } from "../album/model/album.entity";
import { Track } from "../track/model/track.entity";
import { Artist } from "../artist/model/artist.entity";
import { FavoriteService } from "./favorite.service";

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoritesService: FavoriteService) {}
  
  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }
  
  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  addToFavoriteArtists(@Param('id') id: string,
                       @Param() artist: Artist) {
    return this.favoritesService.addToFavoriteArtists(id, artist);
  }
  
  @Delete('artist/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFromFavoriteArtists(@Param('id') id: string) {
    this.favoritesService.removeFromFavoriteArtists(id);
    return HttpStatus.NO_CONTENT;
  }
  
  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  addToFavoriteAlbums(@Param('id') id: string,
                      @Param() album: Album) {
    return this.favoritesService.addToFavoriteAlbums(id, album);
  }
  
  @Delete('album/:id')
  @UsePipes(new ValidationPipe())
  removeFromFavoriteAlbums(@Param('id') id: string) {
    this.favoritesService.removeFromFavoriteAlbums(id);
    return HttpStatus.NO_CONTENT;
  }
  
  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  addToFavoriteTracks(@Param('id') id: string,
                      @Param() track: Track) {
    return this.favoritesService.addToFavoriteTracks(id, track);
  }
  
  @Delete('track/:id')
  @UsePipes(new ValidationPipe())
  removeFromFavoriteTracks(@Param('id') id: string) {
    this.favoritesService.removeFromFavoriteTracks(id);
    return HttpStatus.NO_CONTENT;
  }
}
