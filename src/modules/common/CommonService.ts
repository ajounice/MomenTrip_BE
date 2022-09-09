import { Injectable } from '@nestjs/common';
import { FileStorage } from '@/common/utils';

@Injectable()
export class CommonService {
    constructor(private readonly fileStorage: FileStorage) {}

    async upload(data: Express.Multer.File, type: string): Promise<string> {
        const { path } = await this.fileStorage.upload(type, data);
        return path;
    }
}
