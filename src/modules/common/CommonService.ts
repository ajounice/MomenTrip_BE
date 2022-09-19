import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { FileStorage, VideoConverter } from '@/common/utils';

@Injectable()
export class CommonService {
    constructor(
        private readonly fileStorage: FileStorage,
        private readonly videoConverter: VideoConverter,
    ) {}

    async upload(data: Express.Multer.File, type: string): Promise<string> {
        const { path } = await this.fileStorage.upload(type, data);
        return path;
    }

    async uploadThumbnail(video: Express.Multer.File) {
        const tmpPath = './tmp/tmpVideo';

        const isExist = fs.existsSync('./tmp');

        if (!isExist) {
            fs.mkdirSync('./tmp');
        }

        fs.writeFileSync(tmpPath, video.buffer);

        const savedThumbnail = await this.videoConverter.getThumbnail(tmpPath, video);

        const savedThumbnailBuffer = fs.readFileSync(savedThumbnail);

        const thumbnailPath = await this.fileStorage.upload('thumbnails', {
            buffer: savedThumbnailBuffer,
            mimetype: 'image/png',
        });

        fs.rmSync(tmpPath);
        fs.rmSync(savedThumbnail);

        fs.rmdirSync('./tmp');

        return thumbnailPath;
    }

    async convert(video: Express.Multer.File) {
        const tmpPath = './tmp/tmpVideo';

        const isExist = fs.existsSync('./tmp');

        if (!isExist) {
            fs.mkdirSync('./tmp');
        }

        fs.writeFileSync(tmpPath, video.buffer);

        const convertedVideo = await this.videoConverter.convertToH264(tmpPath, video);

        console.log(fs.readdirSync('./tmp'));

        const convertedVideoBuffer = fs.readFileSync(convertedVideo);

        const videoPath = await this.fileStorage.upload('videos', {
            buffer: convertedVideoBuffer,
            mimetype: 'video/mp4',
        });

        fs.rmSync(tmpPath);
        fs.rmSync(convertedVideo);

        fs.rmdirSync('./tmp');

        return videoPath;
    }
}
