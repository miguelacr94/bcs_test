import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export interface UserInfo {
  document: string;
  name: string;
  employer: string;
  salary: number;
}

@Injectable()
export class MockUserAdapter {
  private readonly users: UserInfo[] = [
    {
      document: '111111111',
      name: 'Juan Pérez',
      employer: 'Acme Corp',
      salary: 5000,
    },
    {
      document: '222222222',
      name: 'María Gómez',
      employer: 'Beta Ltd',
      salary: 7500,
    },
  ];

  async findByDocument(document: string): Promise<UserInfo> {
    const user = this.users.find((u) => u.document === document);
    if (!user) {
      throw new RpcException({
        code: 4001,
        message: `Usuario con documento ${document} no encontrado`,
      });
    }
    return user;
  }
}
