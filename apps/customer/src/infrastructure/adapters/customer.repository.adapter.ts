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

  async findById(id: string): Promise<Customer | null> {
    const doc = await this.customerModel.findById(id).exec();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

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
      name: customer.name,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      document: this.cryptoAdapter.encrypt(customer.document),
      documentHash: this.cryptoAdapter.hash(customer.document),
      familyReference1: customer.familyReference1,
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

    if (!doc) {
      throw new Error(`Customer with id ${customer.id} not found`);
    }

    return this.mapToDomain(doc);
  }

  async update(document: string, data: Partial<Customer>): Promise<Customer> {
    const documentHash = this.cryptoAdapter.hash(document);
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.familyReference1 !== undefined)
      updateData.familyReference1 = data.familyReference1;
    if (data.document) {
      updateData.documentHash = this.cryptoAdapter.hash(data.document);
      updateData.document = this.cryptoAdapter.encrypt(data.document);
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

  private mapToDomain(doc: CustomerDocument): Customer {
    const docObj = doc as unknown as Record<string, unknown>;
    return new Customer(
      (docObj._id as { toString(): string }).toString(),
      docObj.name as string,
      docObj.lastName as string,
      this.cryptoAdapter.decrypt(docObj.document as string),
      docObj.email as string,
      docObj.phone as string,
      docObj.status as boolean,
      docObj.createdAt as Date,
      docObj.updatedAt as Date,
      docObj.familyReference1 as
        { name: string; phone: string; relationship: string } | undefined,
    );
  }
}
