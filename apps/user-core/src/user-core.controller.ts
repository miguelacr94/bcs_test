import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UserCoreService } from './user-core.service';
import { UserInfo } from './infrastructure/adapters/mock-user.adapter';

@Controller('users')
export class UserCoreController {
  constructor(private readonly userService: UserCoreService) {}

  @Get('document/:document')
  async getByDocument(@Param('document') document: string): Promise<UserInfo> {
    const user = await this.userService.getUserByDocument(document);
    if (!user) {
      throw new NotFoundException(`Usuario con documento ${document} no encontrado`);
    }
    return user;
  }
}
