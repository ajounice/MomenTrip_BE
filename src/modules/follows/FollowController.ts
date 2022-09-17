import { FollowListService, FollowService } from '@/modules/follows/services';
import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class FollowController {
    constructor(
        private readonly followListService: FollowListService,
        private readonly followService: FollowService,
    ) {}

    @Post('/:otherNickname/follow')
    async follow(@Req() req, @Param('otherNickname') other: string) {
        const { id } = req.user;
        return await this.followService.follow(id, other);
    }

    @Delete('/:otherNickname/unfollow')
    async unFollow(@Req() req, @Param('otherNickname') other: string) {
        const { id } = req.user;
        return await this.followService.unFollow(id, other);
    }

    @Get('/:userNickname/followers')
    getAllFollwer(@Req() req, @Param('userNickname') nickname: string) {
        const { id } = req.user;
        return this.followListService.getAllFollower(id, nickname);
    }

    @Get('/:userNickname/followings')
    getAllFollwer(@Req() req, @Param('userNickname') nickname: string) {
        const { id } = req.user;
        return this.followListService.getAllFollowing(id, nickname);
    }
}
