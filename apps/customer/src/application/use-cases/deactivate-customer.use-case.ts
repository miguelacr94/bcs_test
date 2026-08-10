import { Injectable, Inject } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../domain/ports/customer.repository.port';

@Injectable()
export class DeactivateCustomerUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found.`);
    }

    await this.customerRepository.update(customer.document, { status: false });
  }
}
