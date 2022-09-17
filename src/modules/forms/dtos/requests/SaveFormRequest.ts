import { Form } from '@/modules/forms/entities';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveFormRequest {
    @IsOptional()
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    tag: string;

    @IsNotEmpty()
    @IsString()
    site: string;

    video: any;

    toEntity(): Form {
        const form = new Form();

        form.content = this.content;

        return form;
    }
}
