import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notify } from '@/modules/notification/entities';
import { UserService } from '@/modules/users/services';
import { User } from '@/modules/users/entities';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notify)
        private readonly notifyRepository: Repository<Notify>,
    ) {}

    public async saveNotification(type: string, data: number, user: User): Promise<Notify> {
        const notify = new Notify();
        notify.type = type;
        notify.data = data;
        notify.user = user;
        console.log(notify);
        return this.notifyRepository.save(notify);
    }

    async getNotification(userId: number): Promise<Notify[]> {
        return await this.notifyRepository.find({
            where: { user: { id: userId } },
        });
    }
}
