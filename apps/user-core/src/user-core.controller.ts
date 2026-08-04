import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserCoreService } from './user-core.service';
import { UserPattern } from '@app/shared/enums';

@Controller()
export class UserCoreController {
  private readonly logger = new Logger(UserCoreController.name);

  constructor(private readonly userService: UserCoreService) {}

  @MessagePattern({ cmd: UserPattern.GET_USER_BY_DOCUMENT })
  async getByDocument(@Payload() data: { document: string }) {
    this.logger.log(`User-Core: Consultando documento ${data.document}`);
    const user = await this.userService.getUserByDocument(data.document);
    return user || null;
  }
}
