import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService, UserProfileService, UserFollowService } from '@/modules/users/services';
import { CreateUserInfoDto, UpdateUserInfoDto } from '@/modules/users/dto';
import { NotFoundException } from '@/common/exceptions';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly userProfileService: UserProfileService,
        private readonly userFollowService: UserFollowService,
    ) {}

    //프로필 확인(본인)
    @Get('/me')
    async getMyProfile(@Req() req) {
        const { id } = req.user;
        const info = await this.userProfileService.getUserProfile(id);
        if (!info) {
            throw new NotFoundException();
        }
        return info;
    }

    //프로필 확인(타인)
    @Get('/:nickname')
    async getProfile(@Param('nickname') nickname: string) {
        const user = await this.userService.findByNickname(nickname);
        const info = await this.userProfileService.getUserProfile(user.id);
        if (!info) {
            throw new NotFoundException();
        }
        return info;
    }

    //프로필 수정 페이지 조회
    @Get('me/edit')
    async getUserProfile(@Req() req) {
        const { id } = req.user;
        const info = await this.userProfileService.getUserProfile(id);
        if (!info) {
            throw new BadRequestException();
        }
        return info;
    }

    //닉네임 중복 검사
    @Get('me/edit/check-nickname')
    checkNickname(@Body() nickname: string) {
        return this.userService.checkNickname(nickname);
    }

    //프로필 수정 - 최초(닉네임 필수)
    @Patch('me/edit')
    async createUserProfile(
        @Req() req,
        @Body() nickname: string,
        @Body() createUserInfoDto: CreateUserInfoDto,
    ) {
        const { id } = req.user;
        const createdInfo = await this.userProfileService.createUserProfile(id, createUserInfoDto);
        if (!createUserInfoDto) {
            throw new BadRequestException();
        }
        return createdInfo;
    }

    //프로필 수정 - 최초x
    @Patch('me/edit/update')
    async updateUserProfile(@Req() req, @Body() updateUserInfoDto: UpdateUserInfoDto) {
        const { id } = req.user;
        const updatedInfo = await this.userProfileService.updateUserProfile(id, updateUserInfoDto);
        if (!updatedInfo) {
            throw new BadRequestException();
        }

        return updatedInfo;
    }

    @Patch('/me/edit/image')
    @UseInterceptors(FileInterceptor('profile_image'))
    async updateProfileImage(@Req() req, @UploadedFile() file: Express.Multer.File) {
        const { id } = req.user;
        return await this.userProfileService.updateProfileImage(id, file);
    }
    //계정 변환(일반계정<->비즈니스)

    //탈퇴
    @Delete('/me/quit')
    async remove(@Req() req) {
        const { id } = req.user;
        return this.userService.deleteUser(id);
    }

    //팔로우
    @Post('/:nickname/follow')
    async follow(@Req() req, @Param('nickname') other: string) {
        const { id } = req.user;
        return await this.userFollowService.follow(id, other);
    }

    //언팔로우
    @Delete('/:nickname/unfollow')
    async unFollow(@Req() req, @Param('nickname') other: string) {
        const { id } = req.user;
        return await this.userFollowService.unFollow(id, other);
    }
    //나의 팔로워 리스트
    @Get('/me/followers')
    async getMyFollowerList(@Req() req) {
        const { nickname } = req.user;
        return this.userFollowService.getAllFollower(nickname);
    }

    //나의 팔로잉 리스트
    @Get('/me/followings')
    async getMyFollowingList(@Req() req) {
        const { nickname } = req.user;
        return this.userFollowService.getAllFollowing(nickname);
    }

    //다른 유저의 팔로워 리스트 -유저가 대상(Follow-following)
    @Get('/:nickname/followers')
    async getFollowerList(@Param('nickname') nickname: string) {
        return this.userFollowService.getAllFollower(nickname);
    }

    //다른 유저의 팔로잉 리스트 - 유저가 주체(Follow-follower)
    @Get('/:nickname/followings')
    async getFollowingList(@Param('nickname') nickname: string) {
        return this.userFollowService.getAllFollowing(nickname);
    }


}
