import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWishlistFolderRequest {
    @IsNotEmpty()
    @IsString()
    name!: string;
}
