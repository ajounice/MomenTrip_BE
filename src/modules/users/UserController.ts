import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from '@/modules/users/services/UserService';
import { CreateUserInfoDto, UpdateUserInfoDto } from '@/modules/users/dto';
import { UserProfileService } from '@/modules/users/services';
import { NotFoundException } from '@/common/exceptions';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly userProfileService: UserProfileService,
    ) {}

    //첫 로그인 이후 추가 정보 입력(닉네임, 소개글 등)
    @UseGuards(AuthGuard('jwt'))
    @Patch('/:id')
    async createUserProfile(@Req() req, @Body() createUserInfoDto: CreateUserInfoDto) {
        const { id } = req.user;
        const nicknameCheck = await this.userService.findNickname(createUserInfoDto.nickname);
        if (nicknameCheck) {
            //닉네임 중복 존재
            throw new BadRequestException();
        } else {
            const createdInfo = await this.userProfileService.createUserProfile(
                id,
                createUserInfoDto,
            );
            if (!createUserInfoDto) {
                throw new BadRequestException();
            }
            return createdInfo;
        }
    }

    //프로필 확인(내정보)
    @UseGuards(AuthGuard('jwt'))
    @Get('/:nickname')
    async findById(@Req() req) {
        console.log(req.user);
        const user = req.user.id;
        console.log(user);
        const info = await this.userProfileService.getUserProfile(req.user.id);
        if (!info) {
            throw new NotFoundException();
        }
        return info;
    }

    //프로필 수정
    @UseGuards(AuthGuard('jwt'))
    @Patch('/:nickname/edit')
    async updateUserProfile(@Req() req, @Res() res, @Body() updateUserInfoDto: UpdateUserInfoDto) {
        const { id, nickname } = req.user;
        console.log(id);
        const nicknameCheck = await this.userService.findNickname(nickname);
        //const nickname = await this.userService.getNickname(id);
        if (!nicknameCheck) {
            //닉네임 중복 존재
            throw new BadRequestException();
        } else {
            const updatedInfo = await this.userProfileService.updateUserProfile(
                id,
                updateUserInfoDto,
            );
            if (!updatedInfo) {
                throw new BadRequestException();
            }
            return res.redirect('/users/' + nickname);
            //return updatedInfo;
        }
    }

    //사진 변경
    @UseGuards(AuthGuard('jwt'))
    @Patch('/:nickname/edit/image')
    @UseInterceptors(FileInterceptor('profile_image'))
    async updateProfileImage(@Req() req, @Res() res, @UploadedFile() file: Express.Multer.File) {
        const { id, nickname, image } = req.user;
        console.log({ file });
        await this.userProfileService.updateProfileImage(id, file);
        console.log(image);
        return res.redirect('/users/' + nickname);
    }
    //계정 변환(일반계정<->비즈니스)

    //탈퇴
    @UseGuards(AuthGuard('jwt'))
    @Delete('/:nickname/quit')
    async remove(@Req() req) {
        const { id } = req.user;
        return this.userService.deleteUser(id);
    }
}
