import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { interval, Observable } from 'rxjs';
import { Notify } from '@/modules/notification/entities';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notify)
        private readonly notificationRepository: Repository<Notification>,
    ) {}

    //public async getNotificatione(headers, de): Observable<MessageEvent> {
    //  return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } } as MessageEvent)));
    //}
}
