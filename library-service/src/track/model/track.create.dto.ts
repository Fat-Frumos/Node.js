import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  artistId: string | null;
  
  @IsString()
  albumId: string | null;
  
  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
