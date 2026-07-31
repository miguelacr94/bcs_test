import { Request } from 'express';
import { CurrentUserInterface } from './current-user.interface';

export interface AuthenticatedRequest extends Request {
  user: CurrentUserInterface;
}
