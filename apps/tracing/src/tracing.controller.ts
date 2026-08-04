import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TracingPattern } from '@app/shared/enums';
import { TraceRepository } from './infrastructure/repositories/trace.repository';
import { Trace } from '@app/shared/tracing/interfaces/trace.interface';

@Controller()
export class TracingController {
  private readonly logger = new Logger(TracingController.name);

  constructor(private readonly traceRepository: TraceRepository) {}

  @EventPattern({ cmd: TracingPattern.CREATE_TRACE })
  async handleCreateTrace(@Payload() trace: Trace) {
    try {
      await this.traceRepository.create(trace);
    } catch (error: any) {
      this.logger.error(`Failed to persist trace event: ${error.message}`);
    }
  }
}
