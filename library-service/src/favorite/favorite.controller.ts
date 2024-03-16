import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post, UsePipes, ValidationPipe
} from "@nestjs/common";
import { FavoriteService } from "./favorite.service";

@Controller('favs')
export class FavoriteController {
  
  constructor(private readonly service: FavoriteService) {}
  
  @Get()
  findAll() {
    return this.service.findAll();
  }
  
  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  addToFavoriteArtists(@Param('id') id: string): void {
    return this.service.addToFavoriteArtists(id);
  }
  
  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe())
  removeFromFavoriteArtists(@Param('id') id: string) {
    return this.service.removeFromFavoriteArtists(id);
  }
  
  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  addToFavoriteAlbums(@Param('id') id: string) {
    return this.service.addToFavoriteAlbums(id);
  }
  
  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe())
  removeFromFavoriteAlbums(@Param('id') id: string) {
    return this.service.removeFromFavoriteAlbums(id);
  }
  
  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  addToFavoriteTracks(@Param('id') id: string) {
    return this.service.addToFavoriteTracks(id);
  }
  
  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe())
  removeFromFavoriteTracks(@Param('id') id: string) {
    return this.service.removeFromFavoriteTracks(id);
  }
}
