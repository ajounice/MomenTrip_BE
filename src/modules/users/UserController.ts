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
import {
    CreateUserInfoRequest,
    UpdateUserInfoRequest,
    UpdatePasswordRequest,
} from '@/modules/users/dto/request';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    UserProfileImageResponse,
    UserInfoResponse,
    FollowResponse,
    IsFollowingResponse,
    UserListResponse,
    UpdatePasswordResponse,
} from '@/modules/users/dto/response';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly userProfileService: UserProfileService,
        private readonly userFollowService: UserFollowService,
    ) {}

    //프로필 확인(본인)
    @Get('/my')
    async showMyProfile(@Req() req) {
        const { id } = req.user;
        const info = await this.userProfileService.getProfile(id);
        return info;
    }

    //프로필 확인(타인)
    @Get('/:nickname')
    async showUserProfile(@Param('nickname') nickname: string) {
        const user = await this.userService.findByNickname(nickname);
        const info = await this.userProfileService.getProfile(user.id);
        return info;
    }

    //프로필 수정 페이지 조회
    @Get('my/edit')
    async getMyProfile(@Req() req) {
        const { id } = req.user;
        const info = await this.userProfileService.getProfile(id);
        delete info.badgeList;
        delete info.forms;
        return info;
    }

    //닉네임 중복 검사
    @Post('my/edit/nickname/duplicate')
    async checkNickname(@Body('nickname') nickname: string) {
        if (!nickname) {
            throw new BadRequestException();
        }
        const isDuplicated = await this.userService.checkNickname(nickname);
        return isDuplicated;
    }

    //프로필 수정 - 최초(닉네임 필수)
    @Patch('my/edit')
    async createMyProfile(
        @Req() req,
        @Body() nickname: string,
        @Body() createUserInfoDto: CreateUserInfoRequest,
    ) {
        const { id } = req.user;
        const createdInfo = await this.userProfileService.createProfile(id, createUserInfoDto);
        if (!createUserInfoDto) {
            throw new BadRequestException();
        }
        return new UserInfoResponse(createdInfo);
    }

    //프로필 수정 - 최초x
    @Patch('my/edit/update')
    async updateMyProfile(@Req() req, @Body() updateUserInfoDto: UpdateUserInfoRequest) {
        const { id } = req.user;
        const updatedInfo = await this.userProfileService.updateProfile(id, updateUserInfoDto);
        if (!updatedInfo) {
            throw new BadRequestException();
        }

        return new UserInfoResponse(updatedInfo);
    }

    @Patch('/my/edit/image')
    @UseInterceptors(FileInterceptor('profile_image'))
    async updateMyProfileImage(@Req() req, @UploadedFile() file: Express.Multer.File) {
        const { id } = req.user;
        const path = await this.userProfileService.updateProfileImage(id, file);
        return new UserProfileImageResponse(path);
    }

    @Patch('/my/edit/password')
    async updatePassword(@Req() req, @Body() body: UpdatePasswordRequest) {
        const { id } = req.user;
        const response = await this.userService.updatePassword(id, body);

        return new UpdatePasswordResponse(response);
    }

    //탈퇴
    @Delete('/my/quit')
    async remove(@Req() req) {
        const { id } = req.user;
        return this.userService.deleteUser(id);
    }

    //팔로우
    @Post('/:nickname/follow')
    async follow(@Req() req, @Param('nickname') user: string) {
        const { id } = req.user;
        const result = await this.userFollowService.toggleFollow(id, user);

        return new FollowResponse(result);
    }

    //언팔로우
    @Delete('/:nickname/unfollow')
    async unFollow(@Req() req, @Param('nickname') user: string) {
        const { id } = req.user;
        const result = await this.userFollowService.toggleFollow(id, user);

        return new FollowResponse(result);
    }

    //팔로잉 상태
    @Get('/:nickname/following')
    async checkFollowing(@Req() req, @Param('nickname') user: string) {
        const { id } = req.user;
        const result = await this.userFollowService.checkFollowing(id, user);

        return new IsFollowingResponse(result);
    }

    //팔로워 상태
    @Get('/:nickname/follower')
    async checkFollower(@Req() req, @Param('nickname') user: string) {
        const { id } = req.user;
        const result = await this.userFollowService.checkFollower(id, user);

        return new IsFollowingResponse(result);
    }

    //나의 팔로워 리스트
    @Get('/my/followers')
    async getMyFollowerList(@Req() req) {
        const { nickname } = req.user;

        const result = await this.userFollowService.getAllFollower(nickname);

        return new UserListResponse(result);
    }

    //나의 팔로잉 리스트
    @Get('/my/followings')
    async getMyFollowingList(@Req() req) {
        const { nickname } = req.user;

        const result = await this.userFollowService.getAllFollowing(nickname);

        return new UserListResponse(result);
    }

    //다른 유저의 팔로워 리스트 -유저가 대상(Follow-following)
    @Get('/:nickname/followers')
    async getFollowerList(@Param('nickname') nickname: string) {
        const result = await this.userFollowService.getAllFollower(nickname);

        return new UserListResponse(result);
    }

    //다른 유저의 팔로잉 리스트 - 유저가 주체(Follow-follower)
    @Get('/:nickname/followings')
    async getFollowingList(@Param('nickname') nickname: string) {
        const result = await this.userFollowService.getAllFollowing(nickname);

        return new UserListResponse(result);
    }
}
