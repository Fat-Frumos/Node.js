import { BadRequestException, Injectable } from "@nestjs/common";
import { Track } from "./model/track.entity";
import { TrackDto } from "./model/track.dto";
import { checkId, hasAllFields } from "../utils/validator";
import { TrackDao } from "./track.dao";

@Injectable()
export class TrackService {
  constructor(
    private readonly dao: TrackDao
  ) {
  }
  
  findAll(): Track[] {
    return this.dao.getAllTracks();
  }
  
  findById(id: string): Track {
    checkId(id);
    this.dao.isTrackExist(id);
    return this.dao.getById(id);
  }
  
  create(dto: TrackDto): void {
    if (!hasAllFields(dto, "track")) {
      throw new BadRequestException(
        "Body does not contain required fields");
    } else {
      this.dao.create(dto);
    }
  }
  
  update(id: string, dto: TrackDto) {
    checkId(id);
    checkId(dto.artistId);
    this.dao.isTrackExist(id);
    if (!hasAllFields(dto, "track")) {
      throw new BadRequestException(
        "Body does not contain required fields");
    } else {
      return this.dao.updateTrack(id, dto);
    }
  }
  
  remove(id: string) {
    checkId(id);
    this.dao.isTrackExist(id);
    this.dao.deleteTrack(id);
    this.dao.deleteTrackFromFavorites(id);
  }
}
