import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UserController {
    constructor(private readonly configService: ConfigService) {}

    @Get('/')
    test(): string {
        console.log(this.configService.get<string>('DATABASE_HOST'));
        return 'hehe';
    }
}
