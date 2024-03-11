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
import { ArtistService } from "./artist.service";
import { CreateArtistDto } from "./model/artist.create.dto";
import { UpdateArtistDto } from "./model/artist.update.dto";
import { Artist } from "./model/artist.entity";

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistsService: ArtistService) {}
  
  @Get()
  findAll(): Artist[] {
    return this.artistsService.findAll();
  }
  
  @Get(':id')
  findBy(@Param('id') id: string): Artist {
    return this.artistsService.findById(id);
  }
  
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createArtistDto: CreateArtistDto): Artist {
    return this.artistsService.create(createArtistDto);
  }
  
  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string,
         @Body() updateArtistDto: UpdateArtistDto): Artist {
    return this.artistsService.update(id, updateArtistDto);
  }
  
  @Delete(':id')
  @UsePipes(new ValidationPipe())
  remove(@Param('id') id: string): HttpStatus {
    return this.artistsService.remove(id);
  }
}
