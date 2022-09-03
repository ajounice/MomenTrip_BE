import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from '@/modules/users/UserService';
import { UpdateUserDto } from '@/modules/users/dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    //프로필 확인(내정보)
    @Get('/:id')
    showInfo(@Param('id') id: number) {
        const info = this.userService.show(id);
        console.log(id);
        console.log(info);
        return info;
    }

    //프로필 수정(이미지, 닉네임(아이디)<-중복검사, 이름, 소개글
    @Patch('/:id')
    async updateInfo(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    //계정 변환(일반계정<->비즈니스)

    //탈퇴
    @Delete('/:id/quit')
    remove(@Param('id') id: number) {
        return this.userService.remove(id);
    }

    //차단

    //신고
}
