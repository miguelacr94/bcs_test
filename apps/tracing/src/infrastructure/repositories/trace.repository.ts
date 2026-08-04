import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trace, TraceDocument } from '../schemas/trace.schema';

@Injectable()
export class TraceRepository {
  constructor(
    @InjectModel(Trace.name)
    private readonly traceModel: Model<TraceDocument>,
  ) {}

  async create(trace: Trace): Promise<TraceDocument> {
    const createdTrace = new this.traceModel(trace);
    return createdTrace.save();
  }

  async findByTraceId(traceId: string): Promise<TraceDocument[]> {
    return this.traceModel.find({ traceId }).sort({ timestamp: 1 }).exec();
  }

  async findByService(service: string, limit: number = 100): Promise<TraceDocument[]> {
    return this.traceModel
      .find({ service })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async findByUserId(userId: string, limit: number = 100): Promise<TraceDocument[]> {
    return this.traceModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    service?: string,
  ): Promise<TraceDocument[]> {
    const query: any = {
      timestamp: { $gte: startDate, $lte: endDate },
    };

    if (service) {
      query.service = service;
    }

    return this.traceModel.find(query).sort({ timestamp: -1 }).exec();
  }

  async findErrors(limit: number = 50): Promise<TraceDocument[]> {
    return this.traceModel
      .find({ error: { $exists: true } })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async deleteOldTraces(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.traceModel
      .deleteMany({ timestamp: { $lt: cutoffDate } })
      .exec();

    return result.deletedCount || 0;
  }
}
