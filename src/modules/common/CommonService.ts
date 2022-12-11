import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { FileStorage } from '@/common/utils';
import { VideoProducer } from '@/common/utils/VideoProducer';
import { v4 } from 'uuid';
import { BadRequestException } from '@/common/exceptions';

@Injectable()
export class CommonService {
    constructor(
        private readonly fileStorage: FileStorage,
        private readonly videoProducer: VideoProducer,
    ) {}

    async upload(data: Express.Multer.File, type: string): Promise<string> {
        const { path } = await this.fileStorage.upload(type, data);
        return path;
    }

    async process(video: Express.Multer.File) {
        if (!video.mimetype.includes('video')) {
            throw new BadRequestException('Video File Required');
        }

        const key = `${v4()}-${+new Date()}`;
        const localPath = `./tmp/${video.originalname.slice(0, 10)}-${+new Date()}`;

        fs.mkdirSync(localPath);

        const thumbnailKey = `${key}-thumbnail`;

        fs.writeFileSync(`${localPath}/${key}`, video.buffer);

        const jobId = await this.videoProducer.addJobToQueue({
            localPath,
            thumbnailKey,
            videoKey: key,
        });

        return {
            localPath,
            thumbnailKey,
            videoKey: key,
            jobId,
        };
    }
}
