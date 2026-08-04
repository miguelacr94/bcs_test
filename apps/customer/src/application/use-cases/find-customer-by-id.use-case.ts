import { Injectable, Inject } from '@nestjs/common';
import { Customer } from '../../domain/models/customer.entity';
import { CustomerRepositoryPort } from '../../domain/ports/customer.repository.port';

@Injectable()
export class FindCustomerByIdUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(id: string): Promise<Customer | null> {
    return this.customerRepository.findById(id);
  }
}
