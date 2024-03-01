import { BaseEntities, ResponseData } from '../game/response.model';
import { User } from '../game/user.model';

export interface Room extends BaseEntities<ResponseData>{
  roomId: number;
  roomUsers: User[];
}
