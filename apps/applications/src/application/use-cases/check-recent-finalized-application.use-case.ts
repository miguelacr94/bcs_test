import { Inject, Injectable } from '@nestjs/common';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { ApplicationStatus } from '@app/shared/enums';

@Injectable()
export class CheckRecentFinalizedApplicationUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  async execute(clientId: string): Promise<{
    restricted: boolean;
    availableDate?: string;
    daysRemaining?: number;
  }> {
    const finalizedApp =
      await this.applicationRepository.findByClientIdAndStatus(
        clientId,
        ApplicationStatus.FINALIZED,
      );

    if (finalizedApp) {
      const audits = (await this.applicationRepository.findAuditsByOfferId(
        finalizedApp.id,
      )) as { createdAt?: string | Date }[];
      let finalizedDate = finalizedApp.createdAt;

      if (audits && audits.length > 0) {
        const lastAudit = audits[audits.length - 1];
        if (lastAudit.createdAt) {
          finalizedDate = new Date(lastAudit.createdAt);
        }
      }

      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      const now = new Date();
      const diffMs = now.getTime() - finalizedDate.getTime();

      if (diffMs < thirtyDaysInMs) {
        const availableDate = new Date(
          finalizedDate.getTime() + thirtyDaysInMs,
        );
        const daysRemaining = Math.ceil(
          (thirtyDaysInMs - diffMs) / (1000 * 60 * 60 * 24),
        );

        return {
          restricted: true,
          availableDate: availableDate.toISOString(),
          daysRemaining,
        };
      }
    }

    return { restricted: false };
  }
}
