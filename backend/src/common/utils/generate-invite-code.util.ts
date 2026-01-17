import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GenerateInviteCodeUtil {
  generateInviteCode(): string {
    // берем UUID, убираем дефисы и обрезаем до 8 символов
    return uuidv4().replace(/-/g, '').substring(0, 8);
  }
}
