import { UpdatePasswordDto } from "../user/model/user.update.dto";
import { ArtistDto } from "../artist/model/artist.dto";
import { TrackDto } from "../track/model/track.dto";
import { CreateUserDto } from "../user/model/user.create.dto";
import { AlbumDto } from "../album/model/album.dto";
import { BadRequestException } from "@nestjs/common";

export const isValidId = (id: unknown)  =>
  typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id);

export const checkId = (id: string) =>  {
  if (!isValidId(id)) {
    throw new BadRequestException("Invalid ID format");
  }
}

const FieldsMap = {
  user: [
    { value: 'login', type: ['string'] },
    { value: 'password', type: ['string'] },
  ],
  password: [
    { value: 'oldPassword', type: ['string'] },
    { value: 'newPassword', type: ['string'] },
  ],
  track: [
    { value: 'name', type: ['string'] },
    { value: 'artistId', type: ['string', 'object'] },
    { value: 'albumId', type: ['string', 'object'] },
    { value: 'duration', type: ['number'] },
  ],
  artist: [
    { value: 'name', type: ['string'] },
    { value: 'grammy', type: ['boolean'] },
  ],
  album: [
    { value: 'name', type: ['string'] },
    { value: 'artistId', type: ['string', 'object'] },
    { value: 'year', type: ['number'] },
  ],
};

type Dtos =
  | CreateUserDto
  | TrackDto
  | ArtistDto
  | AlbumDto
  | UpdatePasswordDto;

export function hasAllFields(obj: Dtos, map: keyof typeof FieldsMap) {
  const fields = FieldsMap[map];
  
  if (fields.length !== Object.keys(obj).length) {
    return false;
  }
  
  for (const { value, type } of fields) {
    if (!(value in obj) || !type.some((i: string) => i === typeof obj[value])) {
      return false;
    }
  }
  return true;
}
