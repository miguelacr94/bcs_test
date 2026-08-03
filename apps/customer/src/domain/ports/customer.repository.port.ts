import { Customer } from '../models/customer.entity';

export interface CustomerRepositoryPort {
  findByDocument(document: string): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
  update(document: string, data: Partial<Customer>): Promise<Customer>;
}
