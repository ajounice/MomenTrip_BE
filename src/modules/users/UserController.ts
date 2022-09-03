import { BadRequestException, Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from '@/modules/users/services/UserService';
import { UpdateUserDto } from '@/modules/users/dto';
import { UserBlockService, UserProfileService } from '@/modules/users/services';
import { NotFoundException } from '@/common/exceptions';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly userProfileService: UserProfileService,
        private readonly userBlockService: UserBlockService,
    ) {}

    //프로필 확인(내정보)
    @Get('/:id')
    showInfo(@Param('id') id: number) {
        const info = this.userService.findById(id);
        if (!info) {
            throw new NotFoundException();
        }
        console.log(id);
        return info;
    }

    //프로필 수정(이미지, 닉네임(아이디)<-중복검사, 이름, 소개글
    @Patch('/:id')
    async updateInfo(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        const updatedInfo = await this.userProfileService.update(id, updateUserDto);
        if (!updatedInfo) {
            throw new BadRequestException();
        }
        return updatedInfo;
    }

    //계정 변환(일반계정<->비즈니스)

    //탈퇴
    @Delete('/:id/quit')
    async remove(@Param('id') id: number) {
        return this.userService.remove(id);
    }

    //차단

    //신고
}
