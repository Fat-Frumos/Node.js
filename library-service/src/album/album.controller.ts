import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus, UsePipes, ValidationPipe
} from "@nestjs/common";
import { Album } from "./model/album.entity";
import { AlbumService } from "./album.service";
import { CreateAlbumDto } from "./model/album.create.dto";
import { UpdateAlbumDto } from "./model/album.update.dto";

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
  @UsePipes(new ValidationPipe())
  create(@Body() createAlbumDto: CreateAlbumDto): Album {
    return this.albumsService.create(createAlbumDto);
  }
  
  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string,
         @Body() updateAlbumDto: UpdateAlbumDto): Album {
    return this.albumsService.update(id, updateAlbumDto);
  }
  
  @Delete(':id')
  @UsePipes(new ValidationPipe())
  remove(@Param('id') id: string): HttpStatus {
    return this.albumsService.remove(id);
  }
}
