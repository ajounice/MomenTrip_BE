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
    Body,
} from '@nestjs/common';
import { UserService } from '@/modules/users/UserService';
import { AuthGuard } from '@nestjs/passport';
import { UserKakaoDto } from '@/modules/auth/dtos';
import { User } from '@/modules/users/entities';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async login(@Request() req) {
        return this.userService.findById(req.user);
    }

    @Post()
    async createUser(@Body() user: User) {
        return this.userService.createUser(user);
    }
    @Delete('/:id')
    async deleteUser(@Param('id') userId: number) {
        // TODO: 유저 세션 관련 작업이 완료된 후 해당 세션을 사용하도록 변경해야 함
        const deletedUser = await this.userService.deleteUser(userId);

        if (!deletedUser) {
            throw new BadRequestException();
        }
        return deletedUser;
    }
}
/*
      @Get('/:id')
    async findById(@Param('id') userId: number, password: string) {
        const user = await this.userService.findByLogin(userId, password);
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    

 
 */
