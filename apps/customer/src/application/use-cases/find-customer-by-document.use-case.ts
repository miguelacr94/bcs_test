import { Inject, Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../domain/ports/customer.repository.port';
import { Customer } from '../../domain/models/customer.entity';

@Injectable()
export class FindCustomerByDocumentUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(document: string): Promise<Customer | null> {
    return await this.customerRepository.findByDocument(document);
  }
}
