import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DisbursementsController } from './disbursements.controller';
import { envs } from '@app/shared/config/envs';
import { DisbursementDocument, DisbursementSchema } from './infrastructure/schemas/disbursement.schema';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongo.disbursementsUri),
    MongooseModule.forFeature([
      { name: DisbursementDocument.name, schema: DisbursementSchema },
    ]),
  ],
  controllers: [DisbursementsController],
  providers: [],
})
export class DisbursementsModule {}
