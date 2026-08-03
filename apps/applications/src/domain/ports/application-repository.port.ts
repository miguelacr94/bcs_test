import { PaginationDto } from '@app/shared/dtos';
import { Application } from '../models/application.entity';

export interface ApplicationRepositoryPort {
  save(application: Application): Promise<Application>;
  findById(id: string): Promise<Application | null>;
  findAll(paginationDto: PaginationDto): Promise<{ data: Application[]; total: number }>;
  findByClientIdAndStatus(clientId: string, status: string | string[]): Promise<Application | null>;
  saveAudit(
    offerId: string, 
    type: string, 
    message: string, 
    previousStatus?: string, 
    nextStatus?: string, 
    metadata?: any
  ): Promise<void>;
  findAuditsByOfferId(offerId: string): Promise<any[]>;
}
