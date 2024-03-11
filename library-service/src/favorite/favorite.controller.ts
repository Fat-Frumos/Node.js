import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { Favorite } from "./model/favorite.entity";
import { FavoriteService } from "./favorite.service";
import { FavoriteMessage } from "./model/favorite.message.dto";

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoritesService: FavoriteService) {}
  
  @Get()
  findAll(): Favorite {
    return this.favoritesService.getAllFavorites();
  }
  
  @Post('track/:id')
  @UsePipes(new ValidationPipe())
  addToFavoriteTracks(@Param('id') id: string): FavoriteMessage {
    return this.favoritesService.addToFavoriteTracks(id);
  }
  
  @Delete('track/:id')
  @UsePipes(new ValidationPipe())
  removeFromFavoriteTracks(@Param('id') id: string): FavoriteMessage {
    return this.favoritesService.removeFromFavoriteTracks(id);
  }
  
  @Post('album/:id')
  @UsePipes(new ValidationPipe())
  addToFavoriteAlbums(@Param('id') id: string): FavoriteMessage {
    return this.favoritesService.addToFavoriteAlbums(id);
  }
  
  @Delete('album/:id')
  @UsePipes(new ValidationPipe())
  removeFromFavoriteAlbums(@Param('id') id: string): FavoriteMessage {
    return this.favoritesService.removeFromFavoriteAlbums(id);
  }
  
  @Post('artist/:id')
  @UsePipes(new ValidationPipe())
  addToFavoriteArtists(@Param('id') id: string): FavoriteMessage {
    return this.favoritesService.addToFavoriteArtists(id);
  }
  
  @Delete('artist/:id')
  @UsePipes(new ValidationPipe())
  removeFromFavoriteArtists(@Param('id') id: string): FavoriteMessage {
    return this.favoritesService.removeFromFavoriteArtists(id);
  }
}
