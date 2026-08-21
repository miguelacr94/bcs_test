import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserCoreGatewayService } from './services/user-core-gateway.service';
import { ApiResponse, UserValidationResponse } from '@app/shared';

@ApiTags('Validación Core (Centrales)')
@Controller('users')
export class UserCoreGatewayController {
  private readonly logger = new Logger(UserCoreGatewayController.name);

  constructor(
    private readonly userCoreGatewayService: UserCoreGatewayService,
  ) {}

  @ApiOperation({ summary: 'Validar estado del usuario en centrales y local' })
  @Post('validate')
  async validateStatus(
    @Body() body: { document: string },
  ): Promise<ApiResponse<UserValidationResponse>> {
    this.logger.log(
      `Gateway-Compose: Recibiendo petición de validación core para documento ${body.document}`,
    );
    return await this.userCoreGatewayService.validateStatus(body.document);
  }
}
