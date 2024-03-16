import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TrackController } from "./track/track.controller";
import { TrackService } from "./track/track.service";
import { ArtistController } from "./artist/artist.controller";
import { ArtistService } from "./artist/artist.service";
import { AlbumController } from "./album/album.controller";
import { AlbumService } from "./album/album.service";
import { FavoriteService } from "./favorite/favorite.service";
import { FavoriteController } from "./favorite/favorite.controller";
import { APP_PIPE } from "@nestjs/core";
import { FavoriteDao } from "./favorite/favorite.dao";
import { ArtistDao } from "./artist/artist.dao";
import { AlbumDao } from "./album/album.dao";
import { TrackDao } from "./track/track.dao";
import { UserService } from "./user/user.service";
import { UserController } from "./user/user.controller";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
 ],
  controllers: [
    TrackController,
    UserController,
    AlbumController,
    ArtistController,
    FavoriteController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    TrackService,
    AlbumService,
    ArtistService,
    FavoriteService,
    UserService,
    FavoriteDao,
    ArtistDao,
    AlbumDao,
    TrackDao
    ],
  exports: [FavoriteDao],
})

export class AppModule {
}
