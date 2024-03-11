import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put
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
  findById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Artist {
    return this.artistsService.findById(id);
  }
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createArtistDto: CreateArtistDto): Artist {
    return this.artistsService.create(createArtistDto);
  }
  
  @Put(':id')
  update(@Param('id') id: string,
         @Body() updateArtistDto: UpdateArtistDto): HttpStatus {
    this.artistsService.update(id, updateArtistDto);
    return HttpStatus.NO_CONTENT;
  }
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): HttpStatus {
    this.artistsService.remove(id);
    return HttpStatus.NO_CONTENT;
  }
}
