import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TracingController } from './tracing.controller';
import { envs } from '@app/shared/config/envs';
import { TraceSchema } from './infrastructure/schemas/trace.schema';
import { TraceRepository } from './infrastructure/repositories/trace.repository';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongo.tracingUri),
    MongooseModule.forFeature([{ name: 'Trace', schema: TraceSchema }]),
  ],
  controllers: [TracingController],
  providers: [TraceRepository],
})
export class TracingModule {}
