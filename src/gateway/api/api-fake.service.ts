// api-fake.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ApiFakeService {
  async callApiFake(pathParam: string): Promise<any> {
    const response = await axios.get(
      `https://testkev.free.beeceptor.com/todos/${pathParam}`,
    );
    return response.data;
  }
}
