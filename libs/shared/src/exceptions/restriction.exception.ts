import { DomainException } from './domain.exception';

export class RestrictionException extends DomainException {
  constructor(
    message: string,
    public readonly availableDate: string,
    public readonly daysRemaining: number,
  ) {
    super(message);
    this.name = 'RestrictionException';
  }
}
