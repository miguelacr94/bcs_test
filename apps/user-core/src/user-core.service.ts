import { Injectable } from '@nestjs/common';
import { MockUserAdapter, UserInfo } from './infrastructure/adapters/mock-user.adapter';

@Injectable()
export class UserCoreService {
  constructor(private readonly mockAdapter: MockUserAdapter) {}

  async getUserByDocument(document: string): Promise<UserInfo> {
    return this.mockAdapter.findByDocument(document);
  }
}
