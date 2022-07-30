import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    Request,
    NotFoundException,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { UserService } from '@/modules/users/UserService';
import { AuthGuard } from '@nestjs/passport';

@Controller('/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard('local'))
    @Post()
    async login(@Request() req) {
        return this.userService.findById(req.user);
    }
}
/*
    @Get('/:id')
    async findById(@Param('id') userId: string, password: string) {
        const user = await this.userService.findByLogin(userId, password);
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }

    @Delete('/:id')
    async deleteUser(@Param('id') userId: string ) {
        // TODO: 유저 세션 관련 작업이 완료된 후 해당 세션을 사용하도록 변경해야 함
        const deletedUser = await this.userService.deleteUser(userId);

        if (!deletedUser) {
            throw new BadRequestException();
        }
        return deletedUser;
    }
 
 */
