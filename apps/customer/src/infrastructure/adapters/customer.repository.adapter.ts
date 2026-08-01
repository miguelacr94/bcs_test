import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerRepositoryPort } from '../../domain/ports/customer.repository.port';
import { Customer } from '../../domain/models/customer.entity';
import { CustomerDocument } from '../schemas/customer.schema';

@Injectable()
export class CustomerRepositoryAdapter implements CustomerRepositoryPort {
  constructor(
    @InjectModel(CustomerDocument.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async findByDocument(document: string): Promise<Customer | null> {
    const doc = await this.customerModel.findOne({ document }).exec();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async save(customer: Customer): Promise<Customer> {
    let doc;
    if (customer.id) {
      doc = await this.customerModel
        .findByIdAndUpdate(customer.id, customer, { new: true })
        .exec();
    } else {
      const newCustomer = new this.customerModel(customer);
      doc = await newCustomer.save();
    }
    return this.mapToDomain(doc);
  }

  private mapToDomain(doc: any): Customer {
    return new Customer(
      doc._id.toString(),
      doc.name,
      doc.lastName,
      doc.document,
      doc.email,
      doc.phone,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
