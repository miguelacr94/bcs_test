import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserPattern } from '@app/shared/enums/message-patterns.enum';
import { UserCoreService } from './user-core.service';
import { UserInfo } from './infrastructure/adapters/mock-user.adapter';

/**
 * Controller que maneja los patrones de mensaje del microservicio User‑Core.
 * Escucha el patrón {@link UserPattern.GET_USER_BY_DOCUMENT} enviado por el API‑Gateway.
 */
@Controller()
export class UserCoreMessageController {
  constructor(private readonly userService: UserCoreService) {}

  @MessagePattern({ cmd: UserPattern.GET_USER_BY_DOCUMENT })
  async getUserByDocument(@Payload() data: { document: string }): Promise<UserInfo> {
    try {
      return await this.userService.getUserByDocument(data.document);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Error al buscar usuario con documento ${data.document}`);
    }
  }
}
