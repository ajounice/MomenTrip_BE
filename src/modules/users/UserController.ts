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
    Res,
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
@Controller('/')//기존 users
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly userProfileService: UserProfileService,
        private readonly userFollowService: UserFollowService,
    ) {}

    //닉네임 중복 검사
    @Get('/:nickname/duplicate' || '/:id/duplicate')
    async checkNickname(@Body() nickname: string) {
        return await this.userService.findNickname(nickname);
    }
    //첫 로그인 이후 추가 정보 입력(닉네임, 소개글 등)
    @Patch('/:id')
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

    //프로필 확인(내정보)
    @Get('/:nickname')
    async findById(@Req() req) {
        const { id } = req.user;
        const info = await this.userProfileService.getUserProfile(id);
        if (!info) {
            throw new NotFoundException();
        }
        return info;
    }

    //프로필 수정
    @Patch('/:nickname/edit')
    async updateUserProfile(@Req() req, @Res() res, @Body() updateUserInfoDto: UpdateUserInfoDto) {
        const { id } = req.user;
        const updatedInfo = await this.userProfileService.updateUserProfile(id, updateUserInfoDto);
        if (!updatedInfo) {
            console.log('no updated info');
            throw new BadRequestException();
        }
        return res.redirect('/users/' + updateUserInfoDto.nickname);
    }

    //사진 변경
    @Patch('/:nickname/edit/image')
    @UseInterceptors(FileInterceptor('profile_image'))
    async updateProfileImage(@Req() req, @UploadedFile() file: Express.Multer.File) {
        const { id } = req.user;
        return await this.userProfileService.updateProfileImage(id, file);
    }
    //계정 변환(일반계정<->비즈니스)

    //탈퇴
    @Delete('/:nickname/quit')
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

    //유저의 팔로워 리스트 -유저가 대상(Follow-following)
    @Get('/:nickname/followers')
    async getFollowerList(@Param('nickname') nickname: string) {
        //return this.userProfileService.getFollowerList(nickname);
        return this.userFollowService.getAllFollower(nickname);
    }

    //유저의 팔로잉 리스트 - 유저가 주체(Follow-follower)
    @Get('/:userNickname/followings')
    async getFollowingList(@Param('nickname') nickname: string) {
        //return this.userProfileService.getFollowingList(nickname);
        return this.userFollowService.getAllFollowing(nickname);
    }
}
