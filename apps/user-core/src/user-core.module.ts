import { Module } from '@nestjs/common';
import { UserCoreService } from './user-core.service';
import { MockUserAdapter } from './infrastructure/adapters/mock-user.adapter';
import { UserCoreController } from './user-core.controller';
import { UserCoreMessageController } from './user-core.message.controller';

@Module({
  controllers: [UserCoreController, UserCoreMessageController],
  providers: [UserCoreService, MockUserAdapter],
  exports: [UserCoreService],
})
export class UserCoreModule {}
