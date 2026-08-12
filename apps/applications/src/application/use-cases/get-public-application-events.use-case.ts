import { Inject, Injectable } from '@nestjs/common';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { sortDate } from '@app/shared/interfaces/sort.interface';

@Injectable()
export class GetPublicApplicationEventsUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  async execute(id: string): Promise<unknown[]> {
    return (
      (await this.applicationRepository.findAuditsByApplicationId(id)) as sortDate[]
    ).sort(
      (a: sortDate, b: sortDate) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
}
