import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus, UsePipes, ValidationPipe, HttpCode
} from "@nestjs/common";
import { Album } from "./model/album.entity";
import { AlbumService } from "./album.service";
import { AlbumDto } from "./model/album.dto";

@Controller('album')
export class AlbumController {
  
  constructor(private readonly albumsService: AlbumService) {}
  
  @Get()
  findAll(): Album[] {
    return this.albumsService.findAll();
  }
  
  @Get(':id')
  findBy(@Param('id') id: string): Album {
    return this.albumsService.findById(id);
  }
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  create(@Body() createAlbumDto: AlbumDto): void {
    return this.albumsService.create(createAlbumDto);
  }
  
  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string,
         @Body() updateAlbumDto: AlbumDto): Album {
    return this.albumsService.update(id, updateAlbumDto);
  }
  
  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    return this.albumsService.remove(id);
  }
}
