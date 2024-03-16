import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AlbumModule } from "./album/album.module";
import { UserModule } from "./user/user.module";
import { ArtistModule } from "./artist/artist.module";
import { TrackModule } from "./track/track.module";
import { FavoriteModule } from "./favorite/favorite.module";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";
import { TrackController } from "./track/track.controller";
import { TrackService } from "./track/track.service";
import { ArtistController } from "./artist/artist.controller";
import { ArtistService } from "./artist/artist.service";
import { AlbumController } from "./album/album.controller";
import { AlbumService } from "./album/album.service";
import { FavoriteService } from "./favorite/favorite.service";
import { FavoriteController } from "./favorite/favorite.controller";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { ValidationExceptionFilter } from "./utils/error.handler.controller";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
    UserModule,
    TrackModule,
    AlbumModule,
    ArtistModule,
    FavoriteModule],
  controllers: [
    UserController,
    TrackController,
    AlbumController,
    ArtistController,
    FavoriteController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter
    },
    UserService,
    TrackService,
    AlbumService,
    ArtistService,
    FavoriteService]
})
export class AppModule {
}
