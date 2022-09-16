import { FollowListService, FollowService } from '@/modules/follows/services';
import { Controller } from '@nestjs/common';

@Controller('follows')
export class FollowController {
    constructor(
        private readonly followListService: FollowListService,
        private readonly followService: FollowService,
    ) {}
}
