import { Controller, Sse, UseGuards, Param } from '@nestjs/common';
import { NotificationService } from '@/modules/notification/NotificationService';
import { AuthGuard } from '@nestjs/passport';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface MessageEvent {
    data: string | object;
    userId: number;
    type?: string;
    retry?: number;
}

//@UseGuards(AuthGuard('jwt'))
@Controller('')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Sse('sse/:id')
    async sse(@Param('id') id: number): Promise<Observable<MessageEvent>> {
        const notifies = await this.notificationService.getNotification(id);
        return interval(1000).pipe(map(() => ({ data: { notifies } } as MessageEvent)));
    }
    //
}
