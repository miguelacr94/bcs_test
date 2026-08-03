import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TraceSchema } from './infrastructure/schemas/trace.schema';
import { TraceRepository } from './infrastructure/repositories/trace.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Trace', schema: TraceSchema }]),
    ConfigModule,
  ],
  providers: [TraceRepository],
  exports: [TraceRepository],
})
export class TracingModule {}
