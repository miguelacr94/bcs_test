import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DisbursementDocument } from './infrastructure/schemas/disbursement.schema';
import { DisbursementPattern } from '@app/shared/enums';

@Controller()
export class DisbursementsController {
  private readonly logger = new Logger(DisbursementsController.name);

  constructor(
    @InjectModel(DisbursementDocument.name)
    private disbursementModel: Model<DisbursementDocument>,
  ) {}

  @MessagePattern({ cmd: DisbursementPattern.CREATE_DISBURSEMENT })
  async createDisbursement(
    @Payload()
    data: {
      applicationId: string;
      clientId: string;
      amount: number;
    },
  ) {
    try {
      this.logger.log(
        `Received request to disburse ${data.amount} for application ${data.applicationId}`,
      );

      const newDisbursement = new this.disbursementModel({
        applicationId: new Types.ObjectId(data.applicationId),
        clientId: new Types.ObjectId(data.clientId),
        amount: data.amount,
        status: 'SCHEDULED',
      });

      const saved = await newDisbursement.save();
      this.logger.log(`Disbursement scheduled with ID ${saved._id}`);
      return saved;
    } catch (error: unknown) {
      this.logger.error(
        `Error scheduling disbursement: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new RpcException({
        error: error instanceof Error ? error.message : String(error),
        statusCode: 400,
      });
    }
  }
}
