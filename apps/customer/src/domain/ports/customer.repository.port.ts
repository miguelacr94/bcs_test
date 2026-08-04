import { Customer } from '../models/customer.entity';

export interface CustomerRepositoryPort {
  findById(id: string): Promise<Customer | null>;
  findByDocument(document: string): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
  update(document: string, data: Partial<Customer>): Promise<Customer>;
}
