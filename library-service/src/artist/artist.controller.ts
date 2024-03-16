import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put, UsePipes, ValidationPipe
} from "@nestjs/common";
import { ArtistService } from "./artist.service";
import { ArtistDto } from "./model/artist.dto";
import { Artist } from "./model/artist.entity";

@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistsService: ArtistService
  ) {}
  
  @Get()
  findAll(): Artist[] {
    return this.artistsService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistsService.findById(id);
  }
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  create(@Body() createArtistDto: ArtistDto): Artist {
    return this.artistsService.create(createArtistDto);
  }
  
  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string,
         @Body() updateArtistDto: ArtistDto): Artist {
    return this.artistsService.update(id, updateArtistDto);
  }
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    return this.artistsService.remove(id);
  }
}
