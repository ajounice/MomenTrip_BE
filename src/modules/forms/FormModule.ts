import { Module } from '@nestjs/common';
import { FormController } from './FormController';
import { FormService } from './FormService';

@Module({
    controllers: [FormController],
    providers: [FormService],
})
export class FormModule {}
