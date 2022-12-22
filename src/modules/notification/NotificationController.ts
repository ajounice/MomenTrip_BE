import { Controller, Sse, UseGuards, Param, Req } from '@nestjs/common';
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

@UseGuards(AuthGuard('jwt'))
@Controller('/notify')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Sse('')
    async sse(@Req() req): Promise<Observable<MessageEvent>> {
        const { id } = req.user;
        const notifies = await this.notificationService.getNotification(id);
        return interval(1000).pipe(map(() => ({ data: { notifies } } as MessageEvent)));
    }
    //
}
