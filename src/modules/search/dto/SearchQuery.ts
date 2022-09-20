import { IsOptional, IsString } from 'class-validator';

export class SearchQuery {
    @IsOptional()
    @IsString()
    type?: 'form' | 'user';

    @IsOptional()
    @IsString()
    tag?: string;
}
