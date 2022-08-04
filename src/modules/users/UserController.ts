import { Controller } from '@nestjs/common';
import { UserService } from '@/modules/users/UserService';
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
}
