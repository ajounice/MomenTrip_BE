import { Controller, Sse, MessageEvent, Get, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from '@/modules/notification/NotificationService';
import { AuthGuard } from '@nestjs/passport';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@UseGuards(AuthGuard('jwt'))
@Controller('')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Sse('notification')
    public sse(@Req() req) {
        const data = this.notificationService.getNotification();
        return interval(1000).pipe(map((_) => ({ data: { data } })));
    }
    //
}
