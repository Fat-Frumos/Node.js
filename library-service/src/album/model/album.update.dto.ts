import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAlbumDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
  
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  year?: number;
}
