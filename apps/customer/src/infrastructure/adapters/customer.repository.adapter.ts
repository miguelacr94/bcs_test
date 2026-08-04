import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerRepositoryPort } from '../../domain/ports/customer.repository.port';
import { Customer } from '../../domain/models/customer.entity';
import { CustomerDocument } from '../schemas/customer.schema';
import { AesEncryptionAdapter } from '@app/shared/adapters/aes-encryption.adapter';

@Injectable()
export class CustomerRepositoryAdapter implements CustomerRepositoryPort {
  private readonly cryptoAdapter = new AesEncryptionAdapter();

  constructor(
    @InjectModel(CustomerDocument.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async findByDocument(document: string): Promise<Customer | null> {
    // Usamos el hash determinístico para buscar (siempre produce el mismo resultado)
    const documentHash = this.cryptoAdapter.hash(document);
    let doc = await this.customerModel.findOne({ documentHash }).exec();
    
    // Fallback: buscar por documento plano (registros legacy sin encriptar)
    if (!doc) {
      doc = await this.customerModel.findOne({ document }).exec();
    }
    
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async save(customer: Customer): Promise<Customer> {
    const encryptedCustomerData = {
      ...customer,
      document: this.cryptoAdapter.encrypt(customer.document),
      documentHash: this.cryptoAdapter.hash(customer.document),
    };

    let doc;
    if (customer.id) {
      doc = await this.customerModel
        .findByIdAndUpdate(customer.id, encryptedCustomerData, { new: true })
        .exec();
    } else {
      const newCustomer = new this.customerModel(encryptedCustomerData);
      doc = await newCustomer.save();
    }
    return this.mapToDomain(doc);
  }

  async update(document: string, data: Partial<Customer>): Promise<Customer> {
    const documentHash = this.cryptoAdapter.hash(document);
    const updateData = { ...data } as any;
    if (updateData.document) {
      updateData.documentHash = this.cryptoAdapter.hash(updateData.document);
      updateData.document = this.cryptoAdapter.encrypt(updateData.document);
    }

    let doc = await this.customerModel
      .findOneAndUpdate({ documentHash }, updateData, { new: true })
      .exec();

    // Fallback: buscar por documento plano (registros legacy)
    if (!doc) {
      doc = await this.customerModel
        .findOneAndUpdate({ document }, updateData, { new: true })
        .exec();
    }

    if (!doc) {
      throw new Error(`Customer with document ${document} not found`);
    }
    return this.mapToDomain(doc);
  }

  private mapToDomain(doc: any): Customer {
    return new Customer(
      doc._id.toString(),
      doc.name,
      doc.lastName,
      this.cryptoAdapter.decrypt(doc.document),
      doc.email,
      doc.phone,
      doc.createdAt,
      doc.updatedAt,
      doc.familyReference1,
    );
  }
}
