import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
  
  @IsString()
  @IsOptional()
  artistId?: string | null;
  
  @IsString()
  @IsOptional()
  albumId?: string | null;
  
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  duration?: number;
}
